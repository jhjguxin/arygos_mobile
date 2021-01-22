/**
 * 来自于服务端的一些全局配置
 */
import _ from 'lodash';
import { CacheStore } from './../common/utils';
import { constantApi } from './http/index';
const Q = require('q');

export default class ConstGlobal {
  static _instance = null;
  static cacheKey = '@CONST_GLOBAL';

  static async instance() {
    if (_.isEmpty(ConstGlobal._instance)) {
      ConstGlobal._instance = new ConstGlobal();
    }
    ConstGlobal._instance.global_config = await ConstGlobal._instance.fetchConstGlobal();

    return ConstGlobal._instance;
  }

  static clear = () => {
    const cacheKey = ConstGlobal.cacheKey;

    CacheStore.instance().removeKey(cacheKey)
  }

  static async all() {
    let _instance = await this.instance()
    return _instance.global_config;
  }

  async fetchConstGlobal() {
    const cacheKey = ConstGlobal.cacheKey;
    let deferred = Q.defer();

    if (CacheStore.instance().keyExists(cacheKey)) {
      let res = CacheStore.instance().get(cacheKey)

      deferred.resolve(res);
    } else {
      constantApi.global()
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
}