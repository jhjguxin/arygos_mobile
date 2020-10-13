import Vue from 'vue';
import Vuex from 'vuex';

// vuex 持久化存储
import createPersistedState from "vuex-persistedstate";

// modules
import userModule from './module/auth/userModule.js' // 登陆用户信息
import permissionModule from './module/permission/permissionModule.js' // 用户操作权限

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  plugins: [createPersistedState({
    key: "crm:vuex:storage"
  })],
  modules:{
    auth: userModule,
    permission: permissionModule
  }
})