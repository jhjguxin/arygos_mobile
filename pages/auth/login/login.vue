<template>
  <view class="login">
    <common></common>
    <view class="content">
      <!-- 头部logo -->
      <view class="header">
        <image :src="logo"></image>
      </view>
      <!-- 主体表单 -->
      <view class="main">
        <u-form :model="form" ref="uForm" :error-type="errorType">
          <u-form-item prop="login" left-icon='account-fill'>
            <u-input
              v-model="form.login"
              type="number"
              maxlength="11"
              placeholder="请输入11位手机号"
              clearable
              focus
            />
          </u-form-item>
          <u-form-item prop="password" left-icon='lock-fill'>
            <u-input
              v-model="form.password"
              type="password"
              placeholder="密码"
              password-icon
            />
          </u-form-item>
        </u-form>
      </view>

      <u-button
        type='primary'
        class='login-button'
        rotate='isRotate'
        ripple
        @click='handleSubmit'
      >登 录</u-button>

      <!-- 底部信息 -->
      <view class="footer">
        <navigator url="forget" open-type="navigate">找回密码</navigator>
        <text>|</text>
        <navigator url="register" open-type="navigate">注册账号</navigator>
      </view>
    </view>
  </view>
</template>


<script>
  import {
    mapActions
  } from 'vuex';
  import { authApi } from 'services/http';
  import Auth from 'services/auth';
  import _ from 'lodash';

  import logo from 'static/logo.png';

  export default {
    data() {
      return {
        form: {
          login: "",
          password: "",
        },
         errorType: ['toast'],
        rules: {
          login: [
            {
              required: true,
              message: '请输入手机号',
              trigger: ['change','blur'],
            }
          ],
          password: [
            {
              required: true,
              message: '请输入密码',
              trigger: ['change','blur'],
            }
          ]
        },
        auth: null,
        logo
      }
    },
    mounted() {
      let { rules } = this;
      // h5 中如果在 onReady 中可能会导致校验规则不生效
      this.$refs.uForm.setRules(rules);

      // 隐藏 TabBar
      uni.hideTabBar();

      this.auth = new Auth();
    },
    methods: {
      doAuthLogin(data) {
        let { auth } = this;

        authApi.login(data).then((res) => {
          let { data: { code, data: user, remark } } = res;

          if (code == 0) {
            auth.login(user);

            // REVIEW onLaunch 和 onLoad 是并行执行的
            getApp().globalData.initGlobalData();

            _.delay(()=> {
              // REVIEW 跳转到 tabBar 页面只能使用 switchTab 跳转
              _.delay(()=>{
                uni.switchTab({
                  url: "/pages/workbench/workbench",
                  success() {
                    uni.showToast({
                      icon: 'success',
                      title: '登陆成功',
                      duration: 2000
                    });
                  }
                })
              }, 800)

            }, 600);
          } else {
            uni.showToast({
              icon: 'none',
              title: remark || "登陆失败",
              duration: 1000
            })
          }
        })
      },
      handleSubmit() {
        this.$refs.uForm.validate(valid => {
          let { form: {login, password} } = this;
          if (valid) this.doAuthLogin({login, password});
        });
      }
    }
  }
</script>

<style>
  @import url("login.css");
</style>
