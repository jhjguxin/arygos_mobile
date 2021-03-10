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
          <u-form-item :label="form.item.common_id.label" prop="common_id">
            <u-input
              :border="form.item.common_id.border" type="select" :select-open="form.item.common_id.show" v-model="commonDisplay"
              :placeholder="form.item.common_id.placeholder" @click="form.item.common_id.show = true"></u-input>
            <u-select mode="single-column" :list="form.item.common_id.list" v-model="form.item.common_id.show" @confirm="handleSelectCommonConfirm"></u-select>
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
  import { leadCommonApi, customerCommonApi } from 'services/http';

  export default {
    data() {
      let featureLabels = getApp().globalData.featureLabels;

      return {
        klassName: "",
        api: {},
        id: 0,
        successUrl: "",
        permitChecker: {},
        card: {
          full: false,
          title: `转移至其他`,
          subTitle: ""
        },
        form: {},
        featureLabels: featureLabels
      };
    },
    mounted() {
      let { klassName, featureLabels = {}, form: {rules} } = this;
      this.card.subTitle = featureLabels[_.snakeCase(klassName)];

      this.$refs.uForm.setRules(rules);

      this.fetchCommonList();
    },
    onLoad(options) {
      let { ids, klassName, id  } = options;
      let { featureLabels } = this;

      ids = ids.split(",");

      this.klassName = klassName;
      this.id = id;
      this.api = {
        lead_common: leadCommonApi,
        customer_common: customerCommonApi
      }[_.snakeCase(klassName)];
      this.permitChecker = {
        authKey: `${_.snakeCase(_.replace(klassName, "Common", ""))}#turn_${_.snakeCase(klassName)}`
      };
      this.successUrl = {
        lead_common: "/pages/leadCommon/leadList/leadList",
        customer_common: "/pages/customerCommon/customerList/customerList"
      }[_.snakeCase(klassName)];
      this.form = {
        model: {
          ids,
          common_id: null
        },
        item: {
          common_id: {
            label: "转移至",
            placeholder: `请选择转移的${featureLabels[_.snakeCase(klassName)]}`,
            list: [],
            show: false,
            border: false
          }
        },
        rules: {
          common_id: [
            {
              required: true,
              message: `请选择转移的${featureLabels[_.snakeCase(klassName)]}`,
            }
          ]
        },
      };

      uni.setNavigationBarTitle({
        title: `转移至${featureLabels[_.snakeCase(klassName)]}`
      });
    },
    methods: {
      handleSave({values}) {
        let { klassName, id, api, successUrl: url } = this;
        let {common_id, ids} = values;

        api.transfer_to_other({ids, id, [`to_${_.snakeCase(klassName)}_setting_id`]: common_id }).then((res)=> {
          let { data: {code, remark} } = res;

          if (Number(code) === 0) {
            _.delay(()=>{
              uni.redirectTo({
                url
              });
            }, 1000)
            _.delay(()=>{
              uni.showToast({
                icon: 'success',
                title: '转移成功',
                duration: 1000
              });
            }, 1000)
          } else {
            uni.showToast({
              icon: 'none',
              title: remark || "操作失败",
              duration: 1000
            })
          }
        })
      },
      fetchCommonList() {
        let { api, klassName, id } = this;

        api[`${_.snakeCase(klassName)}_settings`]({ admin_only: '1' }).then((res)=> {
          let { data: {code, data: { models }} } = res;


          if (code == 0) {
            models = _.filter(models, (item) => item.is_admin);
            models = _.reject(models, (item)=> item.id == Number(id));
            let list = _.map(models, (item) => {
              let { id: value, name: label } = item;

              return ({
                value, label
              });
            })

            this.form.item.common_id.list = list;
          }
        })
      },
      handleUserIdSelect: function (e) {
        let value = e.value;
        this.form.model.common_id = value;
      },
      handleSelectCommonConfirm: function (e) {
        let value = e[0]?.value;
        this.form.model.common_id = value;
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
    },
    computed: {
      commonDisplay: {
        get: function () {
          let { form: {item: { common_id: { list }}, model: { common_id }} } = this;

          return _.find(list, (opt)=> opt.value == common_id)?.label;
        },
        set: function (value) {
        }
      },
    }
  }
</script>

<style>

</style>
