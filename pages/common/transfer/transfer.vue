<template>
  <view>
    <u-card
      :full="card.full"
      :title="card.title"
      :sub-title="card.subTitle"
      :margin="card.margin"
      :padding="card.padding"
      :show-foot="card.showFoot"
      :border="card.border"
    >
      <view slot="body">
        <u-form :model="form.model" label-width="160" ref="uForm">
          <u-form-item :label="form.item.user_id.label" prop="user_id">
            <select2
              :title="form.item.user_id.label"
              klassName="User"
              mode="selector"
              :placeholder="form.item.user_id.placeholder"
              :value="form.model.user_id"
              @select="handleUserIdSelect"
            />
          </u-form-item>
        </u-form>
      </view>
      <view slot="foot">
        <u-button @click="handleSubmit" type="primary">提交</u-button>
      </view>
    </u-card>
    <permit-checker :authKey="permitChecker.authKey" ></permit-checker>
  </view>
</template>

<script>
  import _ from "lodash";
  import { leadApi, customerApi, opportunityApi, contractApi } from 'services/http';

  export default {
    data() {
      return {
        ids:[],
        klassName: "",
        api: {},
        successUrl: "",
        permitChecker: {},
        card: {
          full: false,
          title: "转移给他人",
          subTitle: ""
        },
        form: {},
        featureLabels: getApp().globalData.featureLabels
      };
    },
    async onLoad(options) {
      let { ids, klassName, successUrl } = options;

      ids = ids.split(",");
      this.api = {
        lead: leadApi,
        customer: customerApi,
        opportunity: opportunityApi,
        contract: contractApi
      }[_.snakeCase(klassName)];
      this.successUrl = successUrl || {
        lead: "/pages/lead/leadList/leadList",
        customer: "/pages/customer/customerList/customerList",
        opportunity: "/pages/opportunity/opportunityList/opportunityList",
        contract: "/pages/contract/contractList/contractList"
      }[_.snakeCase(klassName)];

      this.form = {
        model: {
          ids,
          user_id: null
        },
        item: {
          user_id: {
            label: "转移给",
            placeholder: "请选择转移用户"
          }
        },
        rules: {
          user_id: [
            {
              required: true,
              type: 'object',
              message: '请选择用户',
            }
          ]
        }
      };
      this.permitChecker = {
        authKey: `${_.snakeCase(klassName)}#transfer`
      };
    },
    mounted() {
      let { klassName, featureLabels = {}, form: {rules} } = this;
      this.card.subTitle = featureLabels[_.snakeCase(klassName)];

      this.$refs.uForm.setRules(rules);
    },
    methods: {
      handleSave({values}) {
        let { klassName, api, successUrl: url } = this;
        let {user_id: {value: user_id}, ids} = values;

        api.transfer({ids, user_id}).then((res)=> {
          let { data: {code, remark} } = res;

          if (Number(code) === 0) {
            uni.redirectTo({
              url
            });
            _.delay(()=>{
              uni.showToast({
                icon: 'success',
                title: '转移成功',
                duration: 1000
              });
            }, 200)
          } else {
            uni.showToast({
              icon: 'none',
              title: remark || "操作失败",
              duration: 1000
            })
          }
        })
      },
      handleUserIdSelect: function (e) {
        let value = e.value;
        this.form.model.user_id = value;
      },
      handleSubmit() {
        this.$refs.uForm.validate(valid => {

          if (valid) {
            let { form: { model: values }} = this;
            this.handleSave({ values });
          } else {
            console.log('验证失败');
          }
        });
      }
    }
  }
</script>

<style>

</style>
