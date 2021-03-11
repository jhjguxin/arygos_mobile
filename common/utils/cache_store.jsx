import dayjs from 'dayjs';
import _ from 'lodash';

/**
 * 缓存数据在 uniapp Storage 中并支持 ttl
 * // key will expire in 10 minutes (optional third argument)
 * CacheStore.instance().put('lorem', 'value', 600);
 * CacheStore.instance().get('lorem'); // 'ipsum'
 * CacheStore.instance().removeKey('lorem'); // true
 */
export default class CacheStore {
  static _cacheInstance = null;

  static instance() {
    if (_.isEmpty(CacheStore._cacheInstance)) {
      CacheStore._cacheInstance = new CacheStore();
    }

    return CacheStore._cacheInstance;
  }
  
  constructor() {
  }
  
  put (key, value, ex = 300) {
    let data = {
      value,
      ex: dayjs().add(ex, "second").unix(),
    };

    let cache_key = `cache_store:${key}`;
    
    uni.setStorageSync(
      cache_key, data
    );
  }

  get (key) {
    let cache_key = `cache_store:${key}`;
    let data = uni.getStorageSync(cache_key);
    
    if (!_.isEmpty(data)) {
      if (data.ex > dayjs().unix()) {
        return data.value
      } else {
        this.removeKey(key);
        return null;
      }
    } else {
      return null;
    }
  }
  
  keyExists (key) {
    return ! _.isEmpty(this.get(key));
  }
  
  removeKey (key) {
    let cache_key = `cache_store:${key}`;
    let data = uni.removeStorageSync(cache_key);
  }
}