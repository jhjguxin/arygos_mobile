<template>
  <view>
    <u-card
      full
      :title="model.title"
      :sub-title="model.user.name"
      :margin="card.margin"
      :padding="card.padding"
      :show-foot="card.showFoot"
      :border="card.border"
      v-if="model"
    >
      <view slot="body" class="u-flex">
        <u-row gutter="16" style="width: 85%;">
          <u-col span="12" class="u-font-lg">总结：</u-col>
          <u-col span="12" class="u-font-sm u-border-bottom">{{model.summary}}</u-col>
          <u-col span="12" class="u-font-lg">计划：</u-col>
          <u-col span="12" class="u-font-sm u-border-bottom">{{model.schedule}}</u-col>

        </u-row>
        <view
          class="u-font-40 u-type-error u-text-center "
          style="width: 14%;"
          v-if="model.marking_at"
        >阅</view>
      </view>
      <u-row slot="foot">
        <u-col span="12" class="u-font-lg u-p-t-20">批阅人：<text class="u-font-sm">{{model.marking_user.name}}</text></u-col>
        <u-col span="12" class="u-font-lg u-p-t-20">抄送人：<text class="u-font-sm">{{model.ccUsers}}</text></u-col>
      </u-row>
    </u-card>
    <u-cell-item icon="chat" :title="markingListCellItem.title" :arrow="false"></u-cell-item>
    <uni-list
      :border="true"
      class="marking-list"
     >
      <u-swipe-action
        v-for="(item, index) in markings"
        v-bind:key="item.id"
        :show="item.swipeAction.show" :index="index"
        @click="handleSwipActionClick" @open="handleSwipeActionOpen"
        :options="swipeAction.options"
      >
        <uni-list-item
          :title="item.user.name" :note="item.content"
        >
          <view slot="body"  class="uni-list-item__content">
            <u-row>
              <u-col span="4" class="u-padding-left-0 uni-list-item__content-title u-font-sm">{{ item.user.name }}</u-col>
              <u-col span="8" text-align="right" class="u-font-xs">{{item.createdAt}}</u-col>
            </u-row>
            <text class="uni-list-item__content-note u-font-sm">{{ item.content }}</text>
          </view>
        </uni-list-item>
      </u-swipe-action>
    </uni-list>

    <u-form :model="form.model" ref="uForm" :error-type="form.errorType" class="u-padding-30">
      <u-form-item prop="content">
        <u-input
          v-model="form.model.content" type="textarea"
          border
          placeholder="内容"
        />
      </u-form-item>
    </u-form>
    <u-button type="primary" @click="handleSubmitClick">点评</u-button>
  </view v-if="model">
</template>

<script>
  import _ from 'lodash';
  import dayjs from 'dayjs';
  import { scheduleReportApi } from 'services/http';

  export default {
    data() {
      let { query: {id} } = this.$route;
      return {
        id,
        model: null,
        markings: [],
        card: {
          border: true,
          margin: "0 20rpx",
          padding: 20,
          showFoot: true
        },
        markingListCellItem: {
          title: "点评(0)"
        },
        swipeAction: {
          options: [
            {
              text: '删除',
              style: {
                backgroundColor: '#dd524d'
              }
            }
          ]
        },
        form: {
          errorType: ['toast', 'border'],
          rules: {
            content: [
              {
                min: 3,
                message: '内容不能少于3个字',
                trigger: 'change'
              },
              {
                required: true,
                message: '请输入内容',
                trigger: ['change','blur'],
              }
            ]
          },
          model: {}
        },
      }
    },
    async onLoad() {
      let model = await this.fetchScheduleReportShow();
      this.model = model;

      this.markingListCellItem.title = `点评(${model.markings_count})`;
      uni.setNavigationBarTitle({
        title: model.title || "工作报告详情"
      });

      this.fetchMarkings()
    },
    methods: {
      async fetchScheduleReportShow() {
        let { id } = this;

        let res = await scheduleReportApi.show({id});
        let {
          data: {
            code, remark, data: model
          }
        } = res;

        _.delay(()=>{
          uni.hideLoading();
        }, 100);

        if (code == 0) {
          let format = {
            daily: "YYYY-MM-DD",
            weekly: "YYYY-w周",
            monthly: "YYYY-MM"
          }[model.cycle_type];

          model = {
            ...model,
            title: `${model.user?.name}的${model.cycle_type_i18n}(${dayjs(model.due_at).format(format)})`,
            createdAt: dayjs(model.created_at).format("YYYY-MM-DD HH:mm"),
            ccUsers: _.map(model.cc_users, "name").join(", ") || "无",
          }

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
      fetchMarkings() {
        let { id } = this;

        let res = scheduleReportApi.markings({id}).then((res)=> {
          let {
            data: {
              code, remark, data: {models: markings}
            }
          } = res;

          _.delay(()=>{
            uni.hideLoading();
          }, 100);

          if (code == 0) {
            markings = _.map(markings, (item)=> {
              return {
                ...item,
                createdAt: dayjs(item.created_at).format("YYYY-MM-DD HH:mm"),
                swipeAction: {
                  show: false
                }
              }
            });
            this.markings = markings;
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
        });
      },
      createMarking() {
        let { id } = this;
        let { form: {model: { content }} } = this;

        let params = {
          id,
          marking: { content }
        };
        scheduleReportApi.marking(params).then((res)=> {
          let {
            data: {
              code, remark
            },
          } = res;

          if (code == 0) {
            this.fetchMarkings();
            this.$refs.uForm.resetFields();
            uni.showToast({
              icon: 'success',
              title: "评论成功",
              duration: 1000
            });
          } else {
            _.delay(()=>{
              uni.showToast({
                icon: 'none',
                title: remark || "操作失败",
                duration: 1000
              });
            }, 200);
          }
        })
      },
      doDestroy ({marking_id}) {
        let { id } = this;

        let params = {
          id,
          marking_id
        };
        scheduleReportApi.destroy_marking(params).then((res) => {
          let { data: {code, remark}} = res;
          if (code == 0) {
            this.fetchMarkings();
           } else {
             _.delay(()=>{
               uni.showToast({
                 icon: 'none',
                 title: remark || "操作失败",
                 duration: 1000
               });
             }, 200);
           }
         })
      },
      handleSubmitClick () {
        this.$refs.uForm.validate(valid => {
          if (valid) {
            this.createMarking();
          }
        });
      },
      handleSwipeActionOpen (index) {
        let { markings } = this;
        markings = _.each(markings, (item) => {
          item.swipeAction.show = false;
        });
        markings[index].swipeAction.show = true;

        this.markings = markings;
      },
      handleSwipActionClick (index, option_index) {
        if (option_index === 0) {
          let { markings } = this;
          let marking_id = markings[index]?.id;
          this.doDestroy({marking_id});
        }
      },
    }
  }
</script>

<style>
  .uni-list-item__content {
    width: 100%;
  }
</style>
