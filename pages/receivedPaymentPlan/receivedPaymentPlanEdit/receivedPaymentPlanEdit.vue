<template>
  <view class="wrap">
    <custom-form
      :klassName="klassName"
      :record="record"
      :customFields="customFields"
      @submit="handleSubmit"
      v-if="formReady"
    />
    <permit-checker authKey="received_payment_plan#crud" ></permit-checker>
  </view>
</template>

<script>
  import CustomFieldForm from 'services/custom_field_form';
  import Auth from 'services/auth';
  import {
    receivedPaymentPlanApi,
  } from "services/http";

  export default {
    data() {
      return {
        id: 0,
        formReady: false,
        klassName: "ReceivedPaymentPlan",
        customFields: [],
        record: {},
        featureLabels: getApp().globalData.featureLabels
      }
    },
    async onLoad(options) {
      let { id } = options;

      let { klassName, featureLabels } = this;
      let customFields = await CustomFieldForm.instance().fetchData(klassName);
      let model = await this.fetchReceivedPaymentPlanShow({ id });
      let currentUser = Auth.currentUser();

      this.id = id;
      this.record = {
        user_id: currentUser.id,
        user: {
          id: currentUser.id,
          name: currentUser.name
        }
      };
      this.$set(this, "customFields", customFields);
      this.$set(this, "record", model);
      if (model) this.$set(this, "formReady", true);

      uni.setNavigationBarTitle({
        title: `编辑${featureLabels[_.snakeCase(klassName)]}`
      });
    },
    methods: {
      async fetchReceivedPaymentPlanShow ({ id }) {
        uni.showLoading({
          title: '加载中'
        });

        let res = await receivedPaymentPlanApi.show({id});
        let {
          data: {
            code, remark, data: model
          }
        } = res;

        _.delay(()=>{
          uni.hideLoading();
        }, 100);

        if (code == 0) {
          return model;
        } else {
          _.delay(()=>{
            uni.showToast({
              icon: 'none',
              title: remark || "获取数据失败",
              duration: 1000
            });
          }, 200);
          this.isInvalidData = true;

          return null;
        }
      },
      handleSave(values) {
        let { id } = this;

        receivedPaymentPlanApi.update({id, received_payment_plan: values}).then((res)=> {
          let { data: {code, remark} } = res;

          if (Number(code) === 0) {
              uni.navigateTo({
                url: `/pages/receivedPaymentPlan/receivedPaymentPlanShow/receivedPaymentPlanShow?id=${id}`,
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
        let { klassName: model_klass, id } = this;

        this.handleSave(values);
      }
    }
  }
</script>

<style>
  .wrap {
    padding: 24rpx;
  }
</style>
