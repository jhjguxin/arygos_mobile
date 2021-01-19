<template>
  <view class="u-p-t-20 wrap">
    <u-grid :col="3" v-if="cycleType == null">
      <u-grid-item @click="handleItemClick($event, 'daily')">
        <u-icon name="edit-pen-fill" :size="46"></u-icon>
        <view class="grid-text">写日报</view>
      </u-grid-item>
      <u-grid-item  @click="handleItemClick($event, 'weekly')">
        <u-icon name="edit-pen-fill" :size="46"></u-icon>
        <view class="grid-text">写周报</view>
      </u-grid-item>
      <u-grid-item  @click="handleItemClick($event, 'monthly')">
        <u-icon name="edit-pen-fill" :size="46"></u-icon>
        <view class="grid-text">写月报</view>
      </u-grid-item>
    </u-grid>
    <u-form label-width="160" :model="form.model" ref="uForm" v-if="formReady">
      <!-- 类型 -->
      <u-form-item :label="form.item.cycle_type.label" prop="cycle_type">
        <u-input
          v-model="cycleTypeDisplay"
          disabled
        />
      </u-form-item>

        <!-- 日期 -->
      <u-form-item :label="form.item.due_at.label" prop="due_at" required>
        <u-input
          :border="form.item.due_at.border" type="select" :select-open="form.item.due_at.show" v-model="dueAtDisplay"
          :placeholder="form.item.due_at.placeholder" @click="form.item.due_at.show = true"></u-input>
        <u-select mode="single-column" :list="form.item.due_at.list" v-model="form.item.due_at.show" @confirm="handleSelectDueAtConfirm"></u-select>
      </u-form-item>

      <!-- 批阅人 -->
      <u-form-item :label="form.item.marking_user.label" prop="marking_user" required>
        <select2
          :title="form.item.marking_user.label"
          :klassName="form.item.marking_user.klassName"
          :mode="form.item.marking_user.mode"
          :placeholder="form.item.marking_user.placeholder"
          :value="form.model.marking_user"
          :params="form.item.marking_user.params"
          @select="handleMarkingUserSelect"
        />
      </u-form-item>

      <!-- 抄送人 -->
      <u-form-item :label="form.item.cc_users.label" prop="cc_users">
        <select2
          :title="form.item.cc_users.label"
          :klassName="form.item.cc_users.klassName"
          :mode="form.item.cc_users.mode"
          :placeholder="form.item.cc_users.placeholder"
          :value="form.model.cc_users"
          :params="form.item.cc_users.params"
          @select="handleCcUserSelect"
        />
      </u-form-item>

      <!-- 总结 -->
      <u-form-item :label="form.item.summary.label" prop="summary" required>
        <u-input
          v-model="form.model.summary"
          type="textarea"
          :auto-height="form.item.summary.autoHeight"
          :maxlength="form.item.summary.maxlength"
        />
      </u-form-item>

      <!-- 计划 -->
      <u-form-item :label="form.item.schedule.label" prop="schedule" required>
        <u-input
          v-model="form.model.schedule"
          type="textarea"
          :auto-height="form.item.schedule.autoHeight"
          :maxlength="form.item.summary.maxlength"
        />
      </u-form-item>

      <u-form-item :label="form.item.file_attachments.label" prop="file_attachments">
        <attachment-upload
          maxCount="5"
          @upload="handleUpload"
        />
      </u-form-item>

      <u-button @click="handleSubmit" type="primary" :disabled="! formReady">提交</u-button>
    </u-form>
  </view>
</template>

<script>
  import _ from "lodash";
  import dayjs from "dayjs";
  import {
    scheduleReportApi
  } from 'services/http';

  export default {
    data() {
      return {
        cycleType: null, // 报告类型, 需要先选择提交报告类型
        formReady: false, // 是否显示提交表单
        dueAts: [], // 待提交的日期列表
        form: {
          model: {
            cycle_type: null,
            due_at: null,
            marking_user: null,
            cc_users: [],
            summary: null,
            schedule: null
          },
          item: {
            cycle_type: {
              label: "类型"
            },
            due_at: {
              label: "日期",
              placeholder: "请选择日期",
              show: false
            },
            marking_user: {
              label: "批阅人",
              placeholder: "请选择批阅人",
              klassName: "User",
              mode: "selector"
            },
            cc_users: {
              label: "抄送人",
              placeholder: "请选择抄送人",
              klassName: "User",
              mode: "multi"
            },
            summary: {
              label: "总结",
              placeholder: "请填写总结",
              autoHeight: true,
              maxlength: 3000
            },
            schedule: {
              label: "计划",
              placeholder: "请填写计划",
              autoHeight: true,
              maxlength: 3000
            },
            file_attachments: {
              label: "附件",
            }
          },
          rules: {
            due_at: [
              {
                required: true,
                message: '请选择日期',
              }
            ],
            marking_user: [
              {
                required: true,
                message: '请选择批阅人',
                type: "object"
              }
            ],
            cc_users: [
            ],
            summary: [
              {
                required: true,
                message: '请填写总结',
              }
            ],
            schedule: [
              {
                required: true,
                message: '请填写计划',
              }
            ],
          }

        },
        featureLabels: getApp().globalData.featureLabels
      }
    },
    methods: {
      handleSave({values}) {
        let schedule_report = {
          ..._.pick(values, "cycle_type", "due_at", "summary", "schedule"),
          marking_user_id: values.marking_user?.value,
          cc_user_ids: _.map(values.cc_users, "value"),
          file_attachment_ids: _.map(values.file_attachments, "id")
        }

        scheduleReportApi.create({ schedule_report }).then((res)=> {
          let { data: {code, remark} } = res;

          if (Number(code) === 0) {
            let pages = getCurrentPages();

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
      fetchDueAt() {
        let { cycleType: cycle_type } = this;

        scheduleReportApi.due_at({ cycle_type }).then((res) => {
          let { data: {
            code, remark, data: { due_at: dueAts }
          }} = res;

          if (code == 0) {
            this.form.item.due_at.list = _.map(dueAts, (opt)=> (
            {
              label: opt[0],
              value: opt[1]
            }
            ));
            this.formReady = true;

            _.delay(()=> {
              let { form: {rules} } = this;
              // REVIEW 初始化表单校验
              this.$refs.uForm.setRules(rules);
            }, 50)
          }
        })
      },
      handleItemClick(event, cycleType) {
        this.cycleType = cycleType;
        this.form.model.cycle_type = cycleType;

        this.fetchDueAt();
      },
      handleSelectDueAtConfirm: function (e) {
        let value = e[0]?.value;
        this.form.model.due_at = value;
      },
      handleMarkingUserSelect: function (e) {
        let value = e.value;

        this.form.model.marking_user = value;
      },
      handleCcUserSelect: function (e) {
        let value = e.value;
        this.form.model.cc_users = value;
      },
      handleUpload(lists) {
        let file_attachments = _.map(lists, (item)=> item.response?.payload)
        this.form.model.file_attachments = file_attachments;
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
      cycleTypeDisplay: {
        get: function () {
          let { cycleType } = this;
          const cycleTypes = {
            daily: "日报",
            weekly: "周报",
            monthly: "月报"
          };

          return cycleTypes[cycleType];
        },
        set: function (value) {
        }
      },
      dueAtDisplay: {
        get: function () {
          let { form: { model: { due_at}, item: { due_at: { list }}} } = this;

          return _.find(list, (opt)=> opt.value == due_at)?.label;
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

