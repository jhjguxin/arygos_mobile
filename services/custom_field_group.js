/**
 * 模块自定义字段列表
 * 线索客户等自定义字段数据
 */
import _ from 'lodash';
import { CacheStore } from './../common/utils';
import { constantApi } from './http/index';
const Q = require('q');

export default class  CustomFieldGroup {
  static _instance = null;
  static cacheKey = '@CUSTOM_FIELD_GROUP';

  static instance() {
    if (_.isEmpty( CustomFieldGroup._instance)) {
       CustomFieldGroup._instance = new  CustomFieldGroup();
    }
    return  CustomFieldGroup._instance;
  }

  static clear (klass_name){
    const cacheKey = this.getCacheKey(klass_name);

    CacheStore.instance().removeKey(cacheKey);
  }

  async fetchData(klass_name) {
    const cacheKey = this.getCacheKey(klass_name);
    let deferred = Q.defer();

    if (CacheStore.instance().keyExists(cacheKey)) {
      let res = CacheStore.instance().get(cacheKey);

      deferred.resolve(res);
    } else {
      constantApi.custom_field_group({ klass_name })
        .then((res) => {
          let { data: {data, code} } = res;

          if (code == 0) {
            CacheStore.instance().put(cacheKey, data, 300);

            deferred.resolve(data);
          } else {
            deferred.reject(data);
          }
        });
    }

    return deferred.promise;
  }

  getCacheKey = (klass) => (
    `${ CustomFieldGroup.cacheKey}:${klass}`
  )
}