import Vue from 'vue';
import Vuex from 'vuex';

// vuex 持久化存储
import createPersistedState from "vuex-persistedstate";

// modules
import userModule from './module/auth/userModule' // 登陆用户信息
import permissionModule from './module/permission/permissionModule' // 用户操作权限

import filterColumModule from './module/filterColumn/filterColumnModule' // 列表页启用的筛选字段

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  plugins: [
    createPersistedState({
      key: "crm:vuex:storage",
      storage: {
        getItem: key => uni.getStorageSync(key),
        setItem: (key, value) => uni.setStorageSync(key, value),
        removeItem: key => uni.removeStorageSync(key)
      }
    })
  ],
  modules:{
    auth: userModule,
    permission: permissionModule,
    filterColumn: filterColumModule
  }
})