/**
 * 地区选择数据组件
 * 国家，省，市，区级联数据
 */
import _ from 'lodash';
import { CacheStore } from './../common/utils';
import { geoApi } from './http/index';

export default class Geo {
  static _instance = null;
  static cacheKey = '@GEO';

  static async instance() {
    if (_.isEmpty(Geo._instance)) {
      let geo = new Geo();
      let data = await geo.fetchData();
      geo.data = data;
      Geo._instance = geo;
    }

    return Geo._instance;
  }

  static clear = () => {
    const cacheKey = Geo.cacheKey;

    CacheStore.instance().removeKey(cacheKey)
  }

  async fetchData() {
    return new Promise(async (resolve, reject) => {
      const cacheKey = Geo.cacheKey;

      if (CacheStore.instance().keyExists(cacheKey)) {
        let res = CacheStore.instance().get(cacheKey);

        resolve(res);
      } else {
        let {data: countries_res} = await geoApi.countries();
        let {data: provinces_res} = await geoApi.provinces();
        let {data: cities_res} = await geoApi.cities();
        let {data: districts_res} = await geoApi.districts();
        let data = {};

        if (countries_res.code == 0) {
          data = {
            ...data,
            countries: countries_res.data
          }
        } else {
          console.log.warn("fetch countries_res failure", countries_res);
          reject(countries_res);
        }

        if (provinces_res.code == 0) {
          data = {
            ...data,
            provinces: provinces_res.data
          };
        } else {
          console.log.warn("fetch provinces_res failure", provinces_res);
          reject(provinces_res);
        }

        if (cities_res.code == 0) {
          data = {
            ...data,
            cities: cities_res.data
          };
        } else {
          console.log.warn("fetch cities_res failure", cities_res);
          reject(cities_res);
        }

        if (districts_res.code == 0) {
          data = {
            ...data,
            districts: districts_res.data
          };
        } else {
          console.log.warn("fetch districts_res failure", districts_res);
          reject(districts_res);
        }

        CacheStore.instance().put(cacheKey, data, 600);

        resolve(data);
      }

    })
  }
}