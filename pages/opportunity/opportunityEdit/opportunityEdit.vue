<template>
  <view class="wrap">
    <custom-form
      :klassName="klassName"
      :record="record"
      :customFields="customFields"
      @submit="handleSubmit"
      v-if="formReady"
    />
    <permit-checker authKey="opportunity#edit" ></permit-checker>
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
      let { query: {id} } = this.$route;

      let record = {
        user_id: currentUser.id,
        user: {
          id: currentUser.id,
          name: currentUser.name
        }
      };
      return {
        id,
        formReady: false,
        klassName: "Opportunity",
        customFields: [],
        record,
        featureLabels: getApp().globalData.featureLabels
      }
    },
    async onLoad() {
      let { klassName, id, featureLabels } = this;
      let customFields = await CustomFieldForm.instance().fetchData(klassName);
      let model = await this.fetchOpportunityShow({ id });

      this.$set(this, "customFields", customFields);
      this.$set(this, "record", model);
      if (model) this.$set(this, "formReady", true);

      uni.setNavigationBarTitle({
        title: `编辑${featureLabels[_.snakeCase(klassName)]}`
      });
    },
    methods: {
      async fetchOpportunityShow ({ id }) {
        uni.showLoading({
          title: '加载中'
        });

        let res = await opportunityApi.show({id});
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

        opportunityApi.update({id, opportunity: values}).then((res)=> {
          let { data: {code, remark} } = res;

          if (Number(code) === 0) {
              uni.navigateTo({
                url: `/pages/opportunity/opportunityShow/opportunityShow?id=${id}`,
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
