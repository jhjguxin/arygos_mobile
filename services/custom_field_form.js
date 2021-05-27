/**
 * 自定义字段表单数据
 * 线索客户等表单自定义字段数据
 */
import _ from 'lodash';
import { CacheStore } from './../common/utils';
import { constantApi } from './http/index';

export default class CustomFieldForm {
  static _instance = null;
  static cacheKey = '@CUSTOM_FIELD_FORM';

  static instance() {
    if (_.isEmpty(CustomFieldForm._instance)) {
      CustomFieldForm._instance = new CustomFieldForm();
    }
    return CustomFieldForm._instance;
  }

  static clear (klass_name){
    const cacheKey = this.getCacheKey(klass_name);

    CacheStore.instance().removeKey(cacheKey);
  }

  async fetchData(klass_name) {
    return new Promise((resolve, reject) => {
      const cacheKey = this.getCacheKey(klass_name);

      if (CacheStore.instance().keyExists(cacheKey)) {
        let res = CacheStore.instance().get(cacheKey);

        resolve(res);
      } else {
        constantApi.custom_field_form({ klass_name })
          .then((res) => {
            let { data: {data, code} } = res;

            if (code == 0) {
              CacheStore.instance().put(cacheKey, data, 300);

              resolve(data);
            } else {
              reject(data);
            }
          });
      }

    })
  }

  getCacheKey = (klass) => (
    `${CustomFieldForm.cacheKey}:${klass}`
  )
}