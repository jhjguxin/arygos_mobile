<template>
  <view >
    <common></common>
      <uni-section title="功能设置" type="line"></uni-section>
      <uni-list>
        <uni-list-item title="功能显示" clickable @click="onClick" />
        <uni-list-item title="快捷新增显示" clickable @click="onClick" />
      </uni-list>
      <uni-section title="消息提醒" type="line"></uni-section>
      <uni-list>
        <uni-list-item title="推送设置" clickable @click="onClick" />
      </uni-list>
      <uni-section title="个人信息" type="line"></uni-section>
      <uni-list>
        <uni-list-item title="退出登陆" clickable @click="handleLogoutClick" />
      </uni-list>
      <u-action-sheet
        :list="logoutActionSheet.list"
        v-model="logoutActionSheet.show"
        :tips="logoutActionSheet.tips"
        @click="handleLogoutActionSheetClick"
        :cancel-btn="true"
      ></u-action-sheet>
  </view>
</template>

<script>
  import { authApi, organizationApi } from 'services/http';
  import Auth from 'services/auth';
  import _ from 'lodash';
  
  export default {
    data() {
      return {
        logoutActionSheet: {
          tips: {
            text: '退出登陆不会清除任何数据,你还可以继续登陆此账号！',
          },
          list: [{
            text: '退出当前账号',
          }],
          show: false
        }
      }
    },
    mounted() {
      this.auth = new Auth();
    },
    methods: {
      handleLogoutClick () {
        this.logoutActionSheet.show = true;
      },
      handleLogoutActionSheetClick (index) {
        if (index == 0) {
          this.doLogout();
        }
      },
      doLogout() {
        let { auth } = this;
        
        authApi.sign_out({}).then((res) => {
          let { data: { code, data: user, remark } } = res;
          if (code == 0) {
            auth.logout();
            
            uni.redirectTo({
              url: "/pages/auth/login/login",
              success() {
                _.delay(()=>{
                  uni.showToast({
                    icon: 'success',
                    title: '退出登陆成功',
                    duration: 1000
                  });
                }, 100)
              }
            });
          } else {
            uni.showToast({
              icon: 'none',
              title: remark || "退出登陆失败",
              duration: 1000
            })
          }
        })
      }
    }
  }
</script>

<style>
</style>
