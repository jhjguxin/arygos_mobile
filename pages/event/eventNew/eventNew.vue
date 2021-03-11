<template>
  <view class="wrap">
    <u-form :model="form.model" ref="uForm"  label-width="160">
        <u-form-item :label="form.item.note.label" prop="note">
          <u-input
            v-model="form.model.note"
            :placeholder="form.item.note.placeholder"
            type="textarea"
            :auto-height="form.item.note.autoHeight"
          />
        </u-form-item>
        <u-form-item :label="form.item.remind_at.label" prop="remind_at">
          <u-input
            :border="form.item.remind_at.border" type="select" :select-open="form.item.remind_at.show" v-model="form.model.remind_at"
            :placeholder="form.item.remind_at.placeholder" @click="form.item.remind_at.show = true"></u-input>
          <u-picker v-model="form.item.remind_at.show" mode="time" :default-time="form.model.remind_at" :params="form.item.remind_at.params" @confirm="handleSelectRemindAtConfirm"></u-picker>
        </u-form-item>
        <u-form-item :label="form.item.repeat.label" prop="repeat">
          <u-input
            :border="form.item.repeat.border" type="select" :select-open="form.item.repeat.show" v-model="repeatDisplay"
            :placeholder="form.item.repeat.placeholder" @click="form.item.repeat.show = true"></u-input>
          <u-select mode="single-column" :list="form.item.repeat.list" v-model="form.item.repeat.show" @confirm="handleSelectRepeatConfirm"></u-select>
        </u-form-item>
        <u-form-item :label="form.item.remind_type.label" prop="remind_type">
          <u-input
            :border="form.item.remind_type.border" type="select" :select-open="form.item.remind_type.show" v-model="remindTypeDisplay"
            :placeholder="form.item.remind_type.placeholder" @click="form.item.remind_type.show = true"></u-input>
          <u-select mode="single-column" :list="form.item.remind_type.list" v-model="form.item.remind_type.show" @confirm="handleSelectRemindTypeConfirm"></u-select>
        </u-form-item>
        <u-form-item :label="form.item.user_ids.label" prop="user_ids">
          <select2
            :title="form.item.user_ids.label"
            klassName="User"
            mode="multi"
            :placeholder="form.item.user_ids.placeholder"
            :value="form.model.user_ids"
            @select="handleUserIdsSelect"
          />
        </u-form-item>
        <u-button @click="handleSubmit" type="primary">提交</u-button>
        <u-button @click="handleReset" >重置</u-button>
      </u-form>
  </view>
</template>


<script>
  import _ from "lodash";
  import dayjs from "dayjs";
  import { eventApi } from 'services/http';

  export default {
    data() {
      return {
        form: {}
      };
    },
    onLoad(options) {
      let {related_item_type, related_item_id } = options;
      const currentUser = getApp().$store.getters.getUser;

      this.form = {
        model: {
          note: null,
          remind_at: dayjs().add(1, "days").format("YYYY-MM-DD HH:mm"),
          repeat: "never",
          remind_type: "punctual",
          user_ids: [{
            label: currentUser.name,
            value: currentUser.id
          }],
          related_item_type, related_item_id
        },
        item: {
          note: {
            label: "任务内容",
            placeholder: "请填写任务内容",
            autoHeight: true
          },
          remind_at: {
            label: "开始时间",
            placeholder: "请选择开始时间",
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
          repeat: {
            label: "重复",
            placeholder: "请选择重复类型",
            list: [
              {
                label: "从不重复",
                value: "never"
              },
              {
                label: "每天重复",
                value: "every_day"
              },
              {
                label: "每周重复",
                value: "every_week"
              },
              {
                label: "每月重复",
                value: "every_month"
              },
              {
                label: "每年重复",
                value: "every_year"
              }
            ],
            show: false,
            border: false
           },
          remind_type: {
            label: "提醒时间",
            placeholder: "请选择提醒时间",
            list: [
              {
                label: "准时",
                value: "punctual"
              },
              {
                label: "提前5分钟",
                value: "ago_5_minutes"
              },
              {
                label: "提前15分钟",
                value: "ago_15_minutes"
              },
              {
                label: "提前30分钟",
                value: "ago_30_minutes"
              },
              {
                label: "提前1小时",
                value: "ago_1_hours"
              },
              {
                label: "提前2小时",
                value: "ago_2_hours"
              },
              {
                label: "提前1天",
                value: "ago_1_days"
              },
              {
                label: "提前3天",
                value: "ago_3_days"
              },
              {
                label: "提前1周",
                value: "ago_1_weeks"
              }
            ],
            show: false,
            border: false
          },
          user_ids: {
            label: "参与人",
            placeholder: "请选择参与人",
            show: false
          }
        },
        rules: {
          note: [
            {
              required: true,
              message: '请填写任务内容',
            }
          ],
          remind_at: [
            {
              required: true,
              message: '请填写提醒时间',
            },
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
          user_ids: [
            {
              required: true, message: `参与人是必填的!`,
              trigger: ['blur', 'change'],
              type: 'array'
            }
          ]
        }
      };
    },
    mounted () {
      let { form: {rules} } = this;

      this.$refs.uForm.setRules(rules);
    },
    methods: {
      onBackPress() {
        uni.switchTab({
          url: "/pages/workbench/workbench"
        })
        return true;
      },
      handleSave({values}) {
        values.user_ids = _.map(values.user_ids, "value");

        eventApi.create({event: values}).then((res)=> {
          let { data: {code, remark} } = res;

          if (Number(code) === 0) {
            let pages = getCurrentPages();

            // REVIEW 尝试刷新任务列表
            let prevPage = pages[pages.length - 2]; //上一个页面
            prevPage?.$vm.$refs?.eventList?.fetchListData({reload: true});

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
      handleSelectRemindAtConfirm: function (e) {
        let value = `${e.year}-${e.month}-${e.day} ${e.hour}:${e.minute}:00`;

        this.form.model.remind_at = value;
      },
      handleSelectRepeatConfirm: function (e) {
        let value = e[0]?.value;
        this.form.model.repeat = value;
      },
      handleSelectRemindTypeConfirm: function (e) {
        let value = e[0]?.value;
        this.form.model.remind_type = value;
      },
      handleUserIdsSelect: function (e) {
        let value = e.value;
        this.form.model.user_ids = value;
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
      repeatDisplay: {
        get: function () {
          let { form: {item: { repeat: { list }}, model: { repeat }} } = this;

          return _.find(list, (opt)=> opt.value == repeat)?.label;
        },
        set: function (value) {
        }
      },
      remindTypeDisplay: {
        get: function () {
          let { form: {item: { remind_type: { list }}, model: { remind_type }} } = this;

          return _.find(list, (opt)=> opt.value == remind_type)?.label;
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
