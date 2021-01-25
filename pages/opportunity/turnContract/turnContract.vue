<template>
  <view class="wrap">
    <custom-form
      :klassName="klassName"
      :record="record"
      :customFields="customFields"
      @submit="handleSubmit"
      v-if="formReady"
    />
    <permit-checker authKey="opportunity#turn_to_contract" ></permit-checker>
  </view>
</template>

<script>
  import CustomFieldForm from 'services/custom_field_form';
  import Auth from 'services/auth';
  import {
    opportunityApi,
  } from "services/http";

  export default {
    data() {
      let currentUser = Auth.currentUser();
      let { query: {id: opportunityId } } = this.$route;

      return {
        opportunityId,
        formReady: false,
        klassName: "Contract",
        customFields: [],
        record: null,
        featureLabels: getApp().globalData.featureLabels,
      }
    },
    async onLoad() {
      let { klassName, opportunityId, featureLabels } = this;
      let customFields = await CustomFieldForm.instance().fetchData(klassName);
      let model = await this.doBuildcontract({ id: opportunityId });

      this.$set(this, "customFields", customFields);
      this.$set(this, "record", model);
      if (model) this.$set(this, "formReady", true);

      uni.setNavigationBarTitle({
        title: `转${featureLabels.contract}`
      });
    },
    methods: {
      async doBuildcontract ({ id }) {
        uni.showLoading({
          title: '加载中'
        });

        let res = await opportunityApi.build_contract({id});
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
        let { opportunityId } = this;

        opportunityApi.turn_contract({id: opportunityId, contract: values}).then((res)=> {
          let { data: {code, remark, data: {id }} } = res;

          if (Number(code) === 0) {
              uni.navigateTo({
                url: `/pages/contract/contractShow/contractShow?id=${id}`,
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
        let { record } = this;

        values = {
          ...values,
          contact_assetships: values.contact_assetships || _.map(record.contact_assetships, (item)=> (
            _.pick(item, ["id", "contact_id", "category"])
          )),
          product_assets: values.product_assets || _.map(record.product_assets, (item)=> (
            _.pick(item, ["id", "product_id", "quantity", "recommended_unit_price", "remark"])
          ))
        }

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