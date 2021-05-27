/**
 * 小红点服务
 */
import _ from 'lodash';
import dayjs from 'dayjs';
import { CacheStore } from './../common/utils';
import { reminderApi } from './http/index';

export default class RedDot {
  static _instance = null;
  static cacheKeyTodo = '@REDDOT-TODO';

  static instance() {
    if (_.isEmpty(RedDot._instance)) {
      let redDot = new RedDot();
      RedDot._instance = redDot;
    }

    return RedDot._instance;
  }

  removeTodoDot() {
    const cacheKey = RedDot.cacheKeyTodo;
    CacheStore.instance().removeKey(cacheKey)
  }

  todoDot() {
    return new Promise((resolve, reject) => {
      const cacheKey = RedDot.cacheKeyTodo;

      if (CacheStore.instance().keyExists(cacheKey)) {
        let res = CacheStore.instance().get(cacheKey);

        resolve(res);
      } else {
        let dates = [dayjs().format("YYYY-MM-DD")];
        reminderApi.todo_dot({ dates }).then((res)=> {
          let {data: { data: {dates: _dates} }} = res;
          let value = 0;
          if (_dates[0]) value = String(_dates[0][1]);

          CacheStore.instance().put(cacheKey, value, 600);

          resolve(value);
        });

      }
    })
  }
}