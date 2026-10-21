/**
 * 审批配置服务
 * 开启状态, 审批层级, 抄送人
 */
import _ from 'lodash';
import { CacheStore } from '@/common/utils';
import { approvalApi } from '@/services/http/index';

export default class ApprovalSetting {
  static _approvalSettingInstance = null;
  static cacheKey = '@APPROVAL_SETTING';

  static async instance() {
    if (_.isEmpty(ApprovalSetting._approvalSettingInstance)) {
      ApprovalSetting._approvalSettingInstance = new ApprovalSetting();
    }
    ApprovalSetting._approvalSettingInstance.approval_setting_config = await ApprovalSetting._approvalSettingInstance.fetchApprovalSetting();


    return ApprovalSetting._approvalSettingInstance;
  }

  static clear = () => {
    const cacheKey = ApprovalSetting.cacheKey;

    CacheStore.instance().removeKey(cacheKey)
  }

  get({ name }) {
    let approvalSetting = this.approval_setting_config[_.snakeCase(name)] || {};

    return approvalSetting;
  }

  isEnable = ({ name }) => {
    let approvalSetting = this.approval_setting_config[_.snakeCase(name)] || {};

    if (approvalSetting) {
      return approvalSetting.enable == "1";
    } else {
      return false;
    }
  }

  async fetchApprovalSetting() {
    const cacheKey = ApprovalSetting.cacheKey;

    if (CacheStore.instance().keyExists(cacheKey)) {
      return CacheStore.instance().get(cacheKey);
    }

    try {
      const res = await approvalApi.current();
      let { data: { data, code } } = res;

      if (code == 0) {
        CacheStore.instance().put(cacheKey, data, 300);
        return data;
      }
    } catch (e) {
      console.warn('[ApprovalSetting] 获取审批配置失败', e);
    }

    return {};
  }
}