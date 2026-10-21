/**
 * 用户认证服务
 */

import _ from 'lodash';
import Policy from './policy';
import Feature from './feature';
import { useStore } from '@/store';

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
    useStore().login(user);
    await this.policy.fetchPermission();
    await this.feature.fetchFeature();
  }

  currentUser() {
    return useStore().getUser;
  }

  userToken() {
    return useStore().getAuthToken;
  }

  isLogin() {
    return useStore().getHasLogin;
  }

  logout() {
    uni.clearStorage();
  }
};