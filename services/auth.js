/**
 * 用户认证服务
 */

import _ from 'lodash';
import Policy from './policy';
import Feature from './feature';

export default class Auth {
  static currentUser() {
    let auth = new Auth();
    return auth.currentUser();
  }

  constructor() {
    this.app = getApp();
    this.policy = new Policy ();
    this.feature = new Feature ();
  }

  async login(user) {
    this.app.$store.dispatch('login', user);
    await this.policy.fetchPermission();
    await this.feature.fetchFeature();
  }

  currentUser() {
    let { getUser } = this.app.$store.getters;

    return getUser;
  }

  userToken() {
    let { getAuthToken } = this.app.$store.getters;
    
    return getAuthToken;
  }

  isLogin() {
    let { getHasLogin } = this.app.$store.getters;

    return getHasLogin;
  }

  logout() {
    uni.clearStorage();
  }
};