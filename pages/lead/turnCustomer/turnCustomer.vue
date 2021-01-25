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
    <permit-checker authKey="lead#turn_to_customer" ></permit-checker>
  </view>
</template>

<script>
  import CustomFieldForm from 'services/custom_field_form';
  import Auth from 'services/auth';
  import {
    leadApi,
  } from "services/http";

  export default {
    data() {
      let currentUser = Auth.currentUser();
      let { query: {id: leadId } } = this.$route;

      return {
        leadId,
        formReady: false,
        klassName: "Customer",
        customFields: [],
        record: null,
        featureLabels: getApp().globalData.featureLabels,
      }
    },
    async onLoad() {
      let { klassName, leadId, featureLabels } = this;
      let customFields = await CustomFieldForm.instance().fetchData(klassName);
      let model = await this.doBuildCustomer({ id: leadId });

      this.$set(this, "customFields", customFields);
      this.$set(this, "record", model);
      if (model) this.$set(this, "formReady", true);

      uni.setNavigationBarTitle({
        title: `转${featureLabels.customer}`
      });
    },
    methods: {
      async doBuildCustomer ({ id }) {
        uni.showLoading({
          title: '加载中'
        });

        let res = await leadApi.build_customer({id});
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
        let { leadId } = this;

        leadApi.turn_customer({id: leadId, customer: values}).then((res)=> {
          let { data: {code, remark, data: {id }} } = res;

          if (Number(code) === 0) {
              uni.navigateTo({
                url: `/pages/customer/customerShow/customerShow?id=${id}`,
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
        let model_klass = "Lead";
        let { leadId } = this;

        this.$refs.duplicateCheck.check({
          values, model_klass,
          entity_hash: values,
          exclude_ids: [leadId],
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