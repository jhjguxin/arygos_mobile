/**
 * 权限服务
 */
import _ from 'lodash';
import { permissionApi } from '@/services/http';
import { useStore } from '@/store';

export default class Policy {
  static _policyInstance = null;

  static async instance() {
    if (_.isEmpty(Policy._policyInstance)) {
      Policy._policyInstance = new Policy();
    }
    const { permissions, usercenter_permission } = await Policy._policyInstance.fetchPermission();
    Policy._policyInstance.permissions = permissions;
    Policy._policyInstance.usercenter_permission = usercenter_permission;

    return Policy._policyInstance;
  }

  constructor() {
    this.app = getApp();
  }

  checkPermission({ subject, action, authKey }) {
    if (authKey) {
      [subject, action] = authKey.split("#")
    }
    if (_.isNil(subject)) return true;
    if (subject == 'usercenter') return this.checkUsercenterPermission({action});

    let index = _.findIndex(this.permissions, function (per) {
      if (_.isNull(action)) {
        return per.subject == subject;
      } else {
        return per.subject == subject && (per.action == action || per.action == 'crud');
      }
    })

    return index != -1;
  }

  noPermission({ subject, action, authKey }) {
    return ! this.checkPermission({ subject, action, authKey });
  }

  checkUsercenterPermission({ action }) {
    const { usercenter_permission } = this;

    if (usercenter_permission == 'deny') return false;
    if (action == 'show' && _.includes(usercenter_permission, ['show', 'crud'])) return true;
    if (usercenter_permission == 'crud') return true;

    return false;
  }

  async fetchPermission() {
    const store = useStore();
    let {
      permissions = [],
      usercenter_permission = null
    } = store.getPermissions;

    if (permissions.length > 0) {
      return { permissions, usercenter_permission };
    }

    try {
      const res = await permissionApi.index();
      let { data: { code, data } } = res;
      if (Number(code) == 0) {
        let { permissions, usercenter_permission = null } = data;
        useStore().setPermissions({ permissions, usercenter_permission });
        return { permissions, usercenter_permission };
      }
    } catch (e) {
      console.warn('[Policy] 获取权限失败', e);
    }

    return { permissions: [], usercenter_permission: null };
  }
}