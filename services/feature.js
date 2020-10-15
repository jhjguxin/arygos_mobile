/**
 * 功能特性包装组件
 * 可用状态, 自定义显示名
 */
import _ from 'lodash';
import { CacheStore } from './../common/utils';
import { constantApi } from './http/index';
const Q = require('q');

export default class Feature {
  static _featureInstance = null;
  static cacheKey = '@FEATURE';

  static async instance() {
    if (_.isEmpty(Feature._featureInstance)) {
      Feature._featureInstance = new Feature();
    }
    Feature._featureInstance.feature_config = await Feature._featureInstance.fetchFeature();
    Feature._featureInstance.labels = _.transform(Feature._featureInstance.feature_config, (result, value, key) => {
      return result[key] = value["label"]
    });

    return Feature._featureInstance;
  }

  static clear = () => {
    const cacheKey = Feature.cacheKey;

    CacheStore.instance().removeKey(cacheKey)
  }

  static async getFeature({ name }) {
    let _instance = await this.instance()
    return _instance.get({ name });
  }

  static async all() {
    let _instance = await this.instance()
    return _instance.feature_config;
  }

  get({ name }) {
    let feature = this.feature_config[_.snakeCase(name)] || {};

    return feature;
  }
  
  label({ name }) {
    let { label = name} = this.get({ name }) || {};

    return label;
  }

  isEnable = ({ name }) => {
    let feature = this.feature_config[_.snakeCase(name)] || {};

    if (feature) {
      return feature.enabled;
    } else {
      return true;
    }
  }

  async fetchFeature() {
    const cacheKey = Feature.cacheKey;;
    let deferred = Q.defer();

    if (CacheStore.instance().keyExists(cacheKey)) {
      let res = CacheStore.instance().get(cacheKey)

      deferred.resolve(res);
    } else {
      constantApi.feature()
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