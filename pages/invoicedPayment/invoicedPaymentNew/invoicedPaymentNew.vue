<template>
  <view class="wrap">
    <custom-form
      :klassName="klassName"
      :record="record"
      :customFields="customFields"
      @submit="handleSubmit"
      v-if="formReady"
    />
    <permit-checker authKey="invoiced_payment#create" ></permit-checker>
  </view>
</template>

<script>
  import CustomFieldForm from 'services/custom_field_form';
  import Auth from 'services/auth';
  import {
    invoicedPaymentApi,
    contractApi
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
        contractId: 0,
        formReady: false,
        klassName: "InvoicedPayment",
        customFields: [],
        record,
        featureLabels: getApp().globalData.featureLabels
      }
    },
    async onLoad(options) {
      let { contract_id: contractId } = options;
      let { klassName, featureLabels } = this;
      let customFields = await CustomFieldForm.instance().fetchData(klassName);

      this.contractId = contractId;
      await this.setContract();

      this.$set(this, "customFields", customFields);
      this.$set(this, "formReady", true);

      uni.setNavigationBarTitle({
        title: `新增${featureLabels[_.snakeCase(klassName)]}`
      });
    },
    methods: {
      onBackPress() {
        uni.switchTab({
          url: "/pages/workbench/workbench"
        })
        return true;
      },
      async setContract() {
        let { record, contractId: id } = this;
        if (_.isNil(id)) return;

        let res = await contractApi.show({id});
        let {
          data: {
            code, remark, data: model
          }
        } = res;

        if (code == 0) {
          record.contract_id = id;
          record.contract = _.pick(model, "id", "title")
          this.record = record;
        }
      },
      handleSave(values) {
        invoicedPaymentApi.create({invoiced_payment: values}).then((res)=> {
          let { data: {code, remark} } = res;

          if (Number(code) === 0) {
              uni.navigateTo({
                url: "/pages/invoicedPayment/invoicedPaymentList/invoicedPaymentList",
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
