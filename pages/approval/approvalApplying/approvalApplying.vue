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
       v-if="form.model"
    >
      <view slot="body">
        <u-form :model="form.model" label-width="160" ref="uForm">
          <u-form-item :label="form.item.note.label" prop="note">
            <u-input
              v-model="form.model.note"
              :placeholder="form.item.note.placeholder"
              type="textarea"
              :auto-height="form.item.note.autoHeight"
            />
          </u-form-item>
          <u-form-item :label="form.item.notify_users.label" prop="notify_users">
            <select2
              :title="form.item.notify_users.label"
              :klassName="form.item.notify_users.klassName"
              :mode="form.item.notify_users.mode"
              :placeholder="form.item.notify_users.placeholder"
              :value="form.model.notify_users"
              @select="handleUserIdSelect"
            />
          </u-form-item>
        </u-form>
      </view>
      <view slot="foot">
        <u-button @click="handleSubmit" type="primary">提交</u-button>
      </view>
    </u-card>
  </view>
</template>

<script>
  import _ from "lodash";
  import { approvalApi } from 'services/http';
  import ApprovalSetting from 'services/approval_setting';

  export default {
    data() {
      return {
        approvable_id: null,
        approvable_type: null,
        successUrl: "",
        card: {
          full: false,
          title: "发起审批",
          subTitle: ""
        },
        form: {},
        featureLabels: getApp().globalData.featureLabels
      };
    },
    async onLoad(options) {
      let { approvable_id, approvable_type } = options;
      let approvalSetting = await ApprovalSetting.instance();
      let approvalConfig = approvalSetting.get({name: approvable_type});
      
      this.form = {
        model: {
          note: null,
          notify_users: _.map(approvalConfig.notify_users, (item)=> (
          {
            ...item,
            label: item.name,
            value: String(item.id)
          }
        )),
        },
        item: {
          note: {
            label: "原因",
            placeholder: "请输入原因",
            autoHeight: true
          },
          notify_users: {
            label: "抄送人",
            placeholder: "请选择抄送人",
            klassName: "User",
            mode: "multi"
          }
        },
        rules: {
          note: {
            required: true,
            message: '请输入原因',
          },
          notify_users: [
            {
              required: true,
              type: 'array',
              message: '请选择抄送人',
            }
          ]
        }
      };
      
      _.delay(()=> {
        let { approvable_type, featureLabels = {}, form: {rules} } = this;

        this.card.subTitle = featureLabels[_.snakeCase(approvable_type)];
        this.$refs.uForm.setRules(rules);
      }, 100)

      this.successUrl = `/pages/approval/approvalDetail/approvalDetail?approvable_id=${approvable_id}&approvable_type=${approvable_type}`;
      this.approvable_id = approvable_id;
      this.approvable_type = approvable_type;
    },
    mounted() {
    },
    methods: {
      handleSave({values}) {
        let { approvable_type, approvable_id, successUrl: url } = this;
        let {note, notify_users} = values;
        let notify_user_ids = _.map(values.notify_users, "value");

        approvalApi.applying({approvable_type, approvable_id, note, notify_user_ids}).then((res)=> {
          let { data: {code, remark} } = res;

          if (Number(code) === 0) {
            uni.redirectTo({
              url
            });
            _.delay(()=>{
              uni.showToast({
                icon: 'success',
                title: '操作成功',
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
        this.form.model.notify_users = value;
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
