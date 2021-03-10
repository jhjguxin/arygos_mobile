<template>
  <view class="wrap">
    <u-form :model="form.model" ref="uForm"  label-width="160">
        <u-form-item :label="form.item.content.label" prop="content">
          <u-input
            v-model="form.model.content"
            :placeholder="form.item.content.placeholder"
            type="textarea"
            :auto-height="form.item.content.autoHeight"
          />
        </u-form-item>

        <u-form-item :label="form.item.category.label" prop="category">
          <u-input
            :border="form.item.category.border" type="select" :select-open="form.item.category.show" v-model="categoryDisplay"
            :placeholder="form.item.category.placeholder" @click="form.item.category.show = true"></u-input>
          <u-select mode="single-column" :list="form.item.category.list" v-model="form.item.category.show" @confirm="handleSelectCategoryConfirm"></u-select>
        </u-form-item>

        <!-- 跟进时间 -->
        <u-form-item :label="form.item.revisit_at.label" prop="revisit_at">
          <u-input
            :border="form.item.revisit_at.border" type="select" :select-open="form.item.revisit_at.show" v-model="form.model.revisit_at"
            :placeholder="form.item.revisit_at.placeholder" @click="form.item.revisit_at.show = true"></u-input>
          <u-picker v-model="form.item.revisit_at.show" mode="time" :default-time="form.model.revisit_at" :params="form.item.revisit_at.params" @confirm="handleSelectRevisitAtConfirm"></u-picker>
        </u-form-item>

        <!-- 跟进对象 -->
        <u-form-item :label="form.item.loggable.label" prop="loggable">
          <u-input
            :border="form.item.loggable.border" v-model="loggableDisplay" disabled
          ></u-input>
        </u-form-item>
        <!-- 跟进对象状态 -->
        <u-form-item :label="form.item.loggableStatus.label" prop="loggable">
          <u-input
            :border="form.item.loggableStatus.border" type="select" :select-open="form.item.loggableStatus.show" v-model="loggableStatusDisplay"
            :placeholder="form.item.loggableStatus.placeholder" @click="form.item.loggableStatus.show = true"></u-input>
          <u-select mode="single-column" :list="form.item.loggableStatus.list" v-model="form.item.loggableStatus.show" @confirm="handleSelectLoggableStatusConfirm"></u-select>
        </u-form-item>

        <!-- 关联联系人 -->
        <u-form-item :label="form.item.contacts.label" prop="loggable" v-if="customerId">
          <select2
            :title="form.item.contacts.label"
            klassName="Contact"
            mode="multi"
            :placeholder="form.item.contacts.placeholder"
            :value="form.model.contacts"
            :params="form.item.contacts.params"
            @select="handleContactsSelect"
          />
        </u-form-item>

        <!-- 下次跟进时间 -->
        <u-form-item :label="form.item.remind_at.label" prop="remind_at">
          <u-input
            :border="form.item.remind_at.border" type="select" :select-open="form.item.remind_at.show" v-model="form.model.remind_at"
            :placeholder="form.item.remind_at.placeholder" @click="form.item.remind_at.show = true"></u-input>
          <u-picker v-model="form.item.remind_at.show" mode="time" :default-time="form.model.remind_at" :params="form.item.remind_at.params" @confirm="handleSelectRemindAtConfirm"></u-picker>
        </u-form-item>

        <u-button @click="handleSubmit" type="primary" :disabled="! formReady">提交</u-button>
      </u-form>
  </view>
</template>


<script>
  import _ from "lodash";
  import dayjs from "dayjs";
  import CustomFieldForm from 'services/custom_field_form';
  import {
    revisitLogApi,
    leadApi, customerApi, opportunityApi, contractApi
  } from 'services/http';

  export default {
    data() {
      // uniq 不能使用 this.$route 获取页面参数应该在 onLoad 中获取
      // let { query: {loggable_type, loggable_id} } = this.$route;
      const currentUser = getApp().$store.getters.getUser;

      return {
        klassName: "RevisitLog",
        formReady: false,
        loggable: {},
        customerId: null,
        form: {},
        featureLabels: getApp().globalData.featureLabels
      };
    },
    mounted () {
      let { form: {rules} } = this;

      this.$refs.uForm.setRules(rules);
    },
    async onLoad(options) {
      let {loggable_type, loggable_id} = options;
      let { klassName, featureLabels } = this;

      this.form = {
        model: {
          content: null,
          category: null,
          revisit_at: dayjs().format("YYYY-MM-DD HH:mm"),
          remind_at: dayjs().add(1, "weeks").format("YYYY-MM-DD HH:mm"),
          loggable: "",
          contacts: [],
          loggableStatus: null,
          loggable_type, loggable_id
        },
        item: {
          content: {
            label: "内容",
            placeholder: "请填写跟进内容",
            autoHeight: true
          },
          category: {
            label: "跟进类型",
            placeholder: "请选择跟进类型",
            list: [],
            show: false,
            border: false
          },
          revisit_at: {
            label: "跟进时间",
            placeholder: "请选择跟进时间",
            params: {
              year: true,
              month: true,
              day: true,
              hour: true,
              minute: true,
              second: false
            },
            show: false,
            border: false
          },
          loggable: {
            label: "跟进对象"
          },
          loggableStatus: {
            label: "",
            placeholder: "",
            list: [],
            show: false,
            border: false
          },
          contacts: {
            label: "联系人",
            placeholder: "请选择联系人",
            show: false,
            params: {
              customer_id: null
            }
          },
          remind_at: {
            label: "下次跟进时间",
            placeholder: "请选择下次跟进时间",
            params: {
              year: true,
              month: true,
              day: true,
              hour: true,
              minute: true,
              second: false
            },
            show: false,
            border: false
          }
        },
        rules: {
          content: [
            {
              required: true,
              message: '请填写跟进内容',
            }
          ],
          category: [
            {
              required: true,
              message: '请选择跟类型',
            }
          ],
          revisit_at: [
            {
              required: true,
              message: '请填写跟进时间',
            },
            {
              asyncValidator: (rule, value, callback) => {
                try {
                  let min = dayjs().add(-1, 'weeks').format("YYYY-MM-DD HH:mm");

                  if (min && dayjs(value) < dayjs(min)) {
                    callback(new Error(`输入的跟进时间不能小于${min}!`));
                  }
                  return callback();
                } catch (err) {
                  console.error("校验失败", err);
                  callback(new Error(`输入的跟进时间格式不正确!`));
                }
              },
              trigger: ['change']
            }
          ],
          remind_at: [
            {
              asyncValidator: (rule, value, callback) => {
                try {
                  let min = dayjs();

                  if (min && dayjs(value) < dayjs(min)) {
                    callback(new Error(`输入的开始时间不能小于当前时间!`));
                  }

                  return callback();
                } catch (err) {
                  console.error("校验失败", err);
                  callback(new Error(`输入的开始时间格式不正确!`));
                }
              },
              trigger: ['change']
            }
          ],
        }
      };

      let customFields = await CustomFieldForm.instance().fetchData(klassName);
      let categoryCustomField = _.find(customFields, (customField) => customField.name == "category");
      let categoryList = _.map(categoryCustomField.collection_options, (opt) => (
        {
          label: opt[0],
          value: opt[1]
        }
      ));

      let loggable = await this.fetchLoggable();

      let loggableStatusName = {
        Lead: 'status',
        Customer: 'status',
        Opportunity: 'stage',
        Contract: 'status'
      }[loggable_type];
      let loggableCustomFields = await CustomFieldForm.instance().fetchData(loggable_type);
      let loggableStatusCustomField = _.find(loggableCustomFields, (customField) => (customField.name == loggableStatusName));
      let loggableStatusList = _.map(loggableStatusCustomField.collection_options, (opt) => (
        {
          label: opt[0],
          value: opt[1]
        }
      ));

      this.form.item.category.list = categoryList;
      this.form.item.loggable.label = featureLabels[_.snakeCase(loggable_type)] || "跟进对象";
      this.form.item.loggableStatus.list = loggableStatusList;
      this.form.item.loggableStatus.label = loggableStatusCustomField.label;
      this.form.item.loggableStatus.placeholder = loggableStatusCustomField?.input_html_options?.placeholder;

      this.loggable = loggable || {};
      this.customerId = loggable_type == "Customer" ? loggable.id : loggable.customer_id;
      this.form.item.contacts.params = { customer_id: this.customerId };
      this.loggableStatusCustomField = loggableStatusCustomField;
      this.form.model.loggableStatus = loggable[loggableStatusCustomField?.name];

      this.$set(this, "formReady", true);

      uni.setNavigationBarTitle({
        title: `写${featureLabels[_.snakeCase(klassName)]}`
      });
    },
    methods: {
      handleSave({values}) {
        let { loggableStatusCustomField } = this;

        let revisit_log = {
          ..._.pick(values, "category", "content", "revisit_at", "remind_at"),
          loggable_attrs: {
            ..._.pick(values, "loggable_id", "loggable_type"),
          }
        }
        if (loggableStatusCustomField) {
          revisit_log.update_loggable_attrs = {
            [`${loggableStatusCustomField.name}`]: values.loggableStatus
          }
        }
        if (customerApi) {
          revisit_log.contact_ids = _.map(values.contacts, "value");
        }

        revisitLogApi.create({revisit_log}).then((res)=> {
          let { data: {code, remark} } = res;

          if (Number(code) === 0) {
            let pages = getCurrentPages();

            // REVIEW 尝试刷新任务列表
            let prevPage = pages[pages.length - 2]; //上一个页面
            prevPage?.$refs?.salesActivityList?.fetchListData({});

            uni.navigateBack({
              delta: 1
            });
            _.delay(()=>{
              uni.showToast({
                icon: 'success',
                title: '保存成功',
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
      fetchLoggable: async function () {
        let { form: { model: { loggable_type, loggable_id: id }}} = this;
        let api = {
          Lead: leadApi,
          Customer: customerApi,
          Opportunity: opportunityApi,
          Contract: contractApi
        }[loggable_type];

        let res = await api.show({id});
        let {
          data: {
            code, remark, data: loggable
          }
        } = res;

        if (code == 0) {
          return loggable;
        } else {
          uni.showToast({
            icon: 'none',
            title: remark || "获取数据失败",
            duration: 1000
          });
        }
      },
      handleSelectRevisitAtConfirm: function (e) {
        let value = `${e.year}-${e.month}-${e.day} ${e.hour}:${e.minute}:00`;

        this.form.model.revisit_at = value;
      },
      handleSelectCategoryConfirm: function (e) {
        let value = e[0]?.value;
        this.form.model.category = value;
      },
      handleSelectLoggableStatusConfirm: function (e) {
        let value = e[0]?.value;
        this.form.model.loggableStatus = value;
      },
      handleContactsSelect: function (e) {
        let value = e.value;
        this.form.model.contacts = value;
      },
      handleSelectRemindAtConfirm: function (e) {
        let value = `${e.year}-${e.month}-${e.day} ${e.hour}:${e.minute}:00`;

        this.form.model.remind_at = value;
      },
      handleReset() {
        let { uForm } = this.$refs;

        uForm.resetFields();
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
      categoryDisplay: {
        get: function () {
          let { form: {item: { category: { list }}, model: { category }} } = this;

          return _.find(list, (opt)=> opt.value == category)?.label;
        },
        set: function (value) {
        }
      },
      loggableDisplay: {
        get: function () {
          let { form: { model: { loggable_type }}, loggable } = this;

          switch (loggable_type) {
            case "Lead": case "Customer":
              return loggable?.name;
              break;
            case "Opportunity": case "Contract":
              return loggable?.title;
              break;
          }
        },
        set: function (value) {
        }
      },
      loggableStatusDisplay: {
        get: function () {
          let { form: {item: { loggableStatus: { list }}, model: { loggableStatus }} } = this;

          return _.find(list, (opt)=> opt.value == loggableStatus)?.label;
        },
        set: function (value) {
        }
      }
    }
  }
</script>

<style>
  .wrap {
    padding: 24rpx;
  }
</style>
