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
        klassName: "Contact",
        customFields: [],
        record,
        featureLabels: getApp().globalData.featureLabels
      }
    },
    async onLoad() {
      let { klassName, id, featureLabels } = this;
      let customFields = await CustomFieldForm.instance().fetchData(klassName);
      let model = await this.fetchContactShow({ id });

      this.$set(this, "customFields", customFields);
      this.$set(this, "record", model);
      if (model) this.$set(this, "formReady", true);

      uni.setNavigationBarTitle({
        title: `编辑${featureLabels[_.snakeCase(klassName)]}`
      });
    },
    methods: {
      async fetchContactShow ({ id }) {
        uni.showLoading({
          title: '加载中'
        });

        let res = await contactApi.show({id});
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

        contactApi.update({id, contact: values}).then((res)=> {
          let { data: {code, remark} } = res;

          if (Number(code) === 0) {
              uni.navigateTo({
                url: `/pages/contact/contactShow/contactShow?id=${id}`,
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

        this.$refs.duplicateCheck.check({
          values, model_klass,
          entity_hash: values,
          exclude_ids: [id],
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
