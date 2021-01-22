<template>
  <view>
    <u-tabs :list="uTabs.list" :is-scroll="false" :current="uTabs.current" @change="handleScopeTabClick"></u-tabs>
    <schedule-report-column-filter
      :klassName="klassName" @filterConfirm="handleFilterConfirm"
      @sortColumnChange="handleSortColumnChange"
    />
    <u-gap></u-gap>
    <view class="schedule-report-list">
      <u-swipe-action
        v-for="(item, index) in models"
        :key="item.id"
        :show="item.swipeAction.show" :index="index"
        @click="handleSwipActionClick" @open="handleSwipeActionOpen"
        :options="swipeAction.options"
      >
      <u-card
        full
        :title="item.title"
        :sub-title="item.user.name"
        :margin="card.margin"
        :padding="card.padding"
        :show-foot="card.showFoot"
        :border="card.border"
        @click="handleCardClick($event, item)"
      >
        <view slot="body" class="u-flex">
          <u-row gutter="16" style="width: 85%;">
            <u-col span="12" class="u-font-lg">总结</u-col>
            <u-col span="12" class="u-font-sm u-line-3 u-border-bottom">{{item.summary}}</u-col>
            <u-col span="12" class="u-font-lg u-text-center">计划</u-col>
            <u-col span="12" class="u-font-sm u-line-3 u-border-bottom">{{item.schedule}}</u-col>
          </u-row>
          <view
            class="u-font-40 u-type-error u-text-center "
            style="width: 14%;"
            v-if="item.marking_at"
          >阅</view>
        </view>
        <u-row slot="foot">
          <u-col span="4">
            <u-icon
              name="checkmark" :label="item.card.foot.markingUser"
            ></u-icon>
          </u-col>
          <u-col span="4">
            <u-icon
              name="chat" :label="item.markings_count"
            ></u-icon>
          </u-col>
        </u-row>
      </u-card>
      </u-swipe-action>
    </view>
      <u-empty mode="list" v-show="models.length == 0"/>
      <uni-load-more
        :status="status" :contentText="loadText"
        @clickLoadMore="handleLoadMore"
        v-if="models.length > 0" />
      <u-back-top :scroll-top="backTop.scrollTop" top="backTop.top"></u-back-top>
    </view>
  </view>
</template>

<script>
  import _ from 'lodash';
  import dayjs from 'dayjs';
  import { scheduleReportApi } from 'services/http';

  export default {
    components: {},
    data() {
      return {
        klassName: "ScheduleReport",
        scope: "report_to_me",
        uTabs: {
          list: [
            {
              name: "提交给我报告",
              key: "report_to_me"
            },
            {
              name: "我提交的报告",
              key: "my_submit"
            },
            {
              name: "下属的报告",
              key: "subordinate_submit"
            }
          ],
          current: 0
        },
        card: {
          border: true,
          margin: "0 20rpx",
          padding: 20,
          showFoot: true
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
        loadText: {
          contentdown: '点击加载更多',
          contentrefresh: '加载中',
          contentnomore: '没有更多数据了'
        },
        models: [], // 列表数据
        status: 'more', // 加载状态
        backTop: {
          scrollTop: 0,
          top: 600
        }, // 返回顶部
        filters: [], // 筛选条件
        sort: [], // 排序字段
        pageSize: 10, // 每页显示的数据条数
        page: 1 ,// 当前页数
        featureLabels: getApp().globalData.featureLabels // 自定义模块名
      };
    },
    async onLoad() {
      let { featureLabels } = this;

      uni.setNavigationBarTitle({
        title: this.featureLabels["schedule_report"]
      });

      // 初始化页面数据
      this.fetchScheduleReport({reload: true });
    },
    methods: {
      /**
       * 下拉刷新回调函数
       */
      onPullDownRefresh() {
        this.page = 1
        this.fetchScheduleReport({ reload: true });
      },
      /**
       * 上拉加载回调函数
       */
      onReachBottom() {
        this.handleLoadMore();

      },
      handleLoadMore() {
        let { page, status } = this;

        if (status == 'more') {
          page += 1;
          this.page = page;
          this.fetchScheduleReport({ page });
        }
      },
      /**
       * 获取页面数据
       * @param {Object} reload 参数reload值为true时执行列表初始化逻辑，值为false时执行追加下一页数据的逻辑。默认为false
       */
      fetchScheduleReport({ reload = false, page = 1}) {
        this.status = 'loading';
        let {
          scope,
          cycle_type,
          sort,
          filters,
          models,
          pageSize: per_page,
        } = this;
        if (reload) {
          page = 1;
          models = [];
        };
        uni.showLoading({
          title: '加载中'
        });

        scheduleReportApi.index({ scope, cycle_type, page, per_page, filters, sort }).then((res) => {
          _.delay(()=>{
            uni.hideLoading();
          }, 100)

          let {
            data: {
              data: {
                next_page, models: _models
              }
            },
          } = res;

          const tempList = _.map(_models, (item) => {
            let format = {
              daily: "YYYY-MM-DD",
              weekly: "YYYY-w周",
              monthly: "YYYY-MM"
            }[item.cycle_type];

            return {
              ...item,
              title: `${item.cycle_type_i18n}(${dayjs(item.due_at).format(format)})`,
              createdAt: dayjs(item.created_at).format("YYYY-MM-DD HH:mm"),
              ccUsers: _.map(item.cc_users, "name").join(", ") || "无",
              card: {
                foot: {
                  markingUser: item.marking_user.name
                }
              },
              swipeAction: {
                show: false
              }
            }
          });

          if (next_page) {
            this.status = 'more';
          } else {
            this.status = 'noMore';
          }

          if (reload) {
            // 停止刷新
            uni.stopPullDownRefresh();
          }

          this.models = models.concat(tempList);
        })

      },
      doDestroy({id}) {
        scheduleReportApi.destroy({id}).then((res) => {
          let { data: {code, remark}} = res;
          if (code == 0) {
            this.fetchScheduleReport({ reload: true });
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
      handleScopeTabClick (index) {
        let { uTabs: { list }} = this;
        this.scope = list[index].key;
        this.uTabs.current = index;

        this.fetchScheduleReport({ reload: true });
      },
      handleSortColumnChange (sort) {
        this.sort = sort;

        this.fetchScheduleReport({ reload: true });
      },
      handleFilterConfirm (filters) {
        this.filters = filters;
        this.fetchScheduleReport({ reload: true });
      },
      handleCardClick(e, item) {
        let url = `/pages/scheduleReport/scheduleReportShow/scheduleReportShow?id=${item.id}`

        uni.navigateTo({
          url
        })
      },
      handleSwipeActionOpen (index) {
        let { models } = this;
        models = _.each(models, (item) => {
          item.swipeAction.show = false;
        });
        models[index].swipeAction.show = true;

        this.models = models;
      },
      handleSwipActionClick (index, option_index) {
        if (option_index === 0) {
          let { models } = this;
          let id = models[index]?.id;
          this.doDestroy({id});
        }
      },
    }
  };
</script>

<style>
  .schedule-report-list {
    padding-left: 32rpx;
    overflow-y: scroll;
  }
</style>