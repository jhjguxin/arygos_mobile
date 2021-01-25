/**
 * 权限服务
 */
import _ from 'lodash';
import { permissionApi } from './http';
const Q = require('q');

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
    let deferred = Q.defer();
    let {
      getters: {
        getPermissions: { permissions, usercenter_permission }
      }
    } = this.app.$store;

    if (_.isArray(permissions)) {
      deferred.resolve({ permissions, usercenter_permission });
    } else {
      permissionApi.index()
        .then((res) => {
          let { data: {code, data }} = res;
          if (Number(code) == 0) {
            let  { permissions, usercenter_permission } = data;
            this.app.$store.dispatch('setPermissions', permissions, usercenter_permission);

            deferred.resolve({ permissions, usercenter_permission });
          }

          deferred.resolve([]);
        });
    }
    return deferred.promise;
  }
}