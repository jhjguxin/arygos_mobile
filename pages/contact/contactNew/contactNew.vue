<template>
  <view class="wrap">
    <custom-form
      :klassName="klassName"
      :record="record"
      :customFields="customFields"
      @submit="handleSubmit"
      v-if="formReady"
    />
    <duplicate-check ref="duplicateCheck" @success="handleSave"/>
    <permit-checker authKey="contact#create" ></permit-checker>
  </view>
</template>

<script>
  import CustomFieldForm from 'services/custom_field_form';
  import Auth from 'services/auth';
  import {
    contactApi,
  } from "services/http";

  export default {
    data() {
      let currentUser = Auth.currentUser();

      let record = {
        user_id: currentUser.id,
        user: {
          id: currentUser.id,
          name: currentUser.name
        }
      };
      return {
        formReady: false,
        klassName: "Contact",
        customFields: [],
        record,
        featureLabels: getApp().globalData.featureLabels
      }
    },
    async onLoad() {
      let { klassName, featureLabels } = this;
      let customFields = await CustomFieldForm.instance().fetchData(klassName);

      this.$set(this, "customFields", customFields);
      this.$set(this, "formReady", true);

      uni.setNavigationBarTitle({
        title: `新增${featureLabels[_.snakeCase(klassName)]}`
      });
    },
    methods: {
      handleSave(values) {
        contactApi.create({contact: values}).then((res)=> {
          let { data: {code, remark} } = res;

          if (Number(code) === 0) {
              // REVIEW 跳转到 tabBar 页面只能使用 switchTab 跳转
              uni.switchTab({
                url: "/pages/quickPlus/quickPlus",
                success() {
                  _.delay(()=>{
                    uni.showToast({
                      icon: 'success',
                      title: '保存成功',
                      duration: 1000
                    });
                  }, 200)
                }
              })
          } else {
            uni.showToast({
              icon: 'none',
              title: remark || "操作失败",
              duration: 1000
            })
          }
        })
      },
      handleSubmit(values) {
        let { klassName: model_klass } = this;

        this.$refs.duplicateCheck.check({
          values, model_klass,
          entity_hash: values,
          callback: () => {
            this.handleSave(values);
          }
        });
      }
    }
  }
</script>

<style>
  .wrap {
    padding: 24rpx;
  }
</style>
