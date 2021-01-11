<template>
  <view class="event-list"  :style="style">
    <u-time-line class="timeLine">
      <u-time-line-item
        v-for="(item, index) in models"
        v-bind:key="item.id"
        nodeTop="2"
      >
        <!-- 此处自定义了左边内容，用一个图标替代 -->
        <template v-slot:node>
          <view class="u-node" :style="item.node.style">
            <!-- 此处为uView的icon组件 -->
            <u-icon name="map-fill" color="#fff" :size="24"></u-icon>
          </view>
        </template>
        <template v-slot:content>
          <u-swipe-action
            :show="item.swipeAction.show" :index="index"
            @click="(index, option_index) => handleSwipActionClick(item, index, option_index)" @open="handleSwipeActionOpen"
            :options="item.swipeAction.options"

          >
          <u-card
            full
            :title="item.title"
            :sub-title="item.createdAt"
            :margin="timeLine.card.margin"
            :padding="timeLine.card.padding"
            :show-foot="timeLine.card.showFoot"
            :border="timeLine.card.border"
          >
            <view slot="body">
              <view class="u-order-desc">
                状态：<u-tag :text="item.status_display" :type="item.statusTag.type"></u-tag>
              </view>
              <view class="u-order-desc">内容：{{item.note}}</view>
              <view class="u-order-desc">开始时间：{{item.remindAt}}</view>
              <view class="u-order-desc">提醒类型：{{item.remind_type_display}}</view>
              <view class="u-order-desc">参与人：{{item.userNames}}</view>
            </view>
          </u-card>
          </u-swipe-action>
        </template>
      </u-time-line-item>
    </u-time-line>
    <u-empty class="u-p-t-80" mode="list" :text="uEmpty.text" v-if="models.length == 0"></u-empty>
    <uni-load-more
      :status="status" :contentText="loadText"
      @clickLoadMore="handleLoadMore"
      v-if="models.length > 0" />
  </view>
</template>

<script>
  import _ from 'lodash';
  import dayjs from 'dayjs';
  import prettyBytes from 'pretty-bytes';
  import mime from 'mime-types';
  import { eventApi } from 'services/http';

  export default {
    data() {
      let { style = "height: 55vh;"} = this.$attrs;

      return {
        style,
        models: [],
        status: 'more', // 加载状态
        page: 1,
        perPage: 8, // 分页数
        uEmpty: {
          text: "任务为空"
        },
        timeLine: {
          card: {
            border: true,
            margin: "0 20rpx",
            padding: 20,
            showFoot: true
          },
          node: {
            styles: {
              in_progress: "background: green",
              completed: "background: blue",
              expired: "background: red"
            },
            types: {
              in_progress: "success",
              completed: "primary",
              expired: "error"
            }
          }
        },
        loadText: {
          contentdown: '点击加载更多',
          contentrefresh: '加载中',
          contentnomore: '没有更多数据了'
        }
      };
    },
    mounted() {
      this.fetchListData({});
    },
    created() {
      const currentUser = getApp().$store.getters.getUser;
      this.currentUser = currentUser;
    },
    methods: {
      fetchListData ({ page, reload }) {
        let { params } = this.$attrs;
        let { perPage: per_page, models = [], timeLine, currentUser } = this;

        if (reload) {
          page = 1;
        }

        params = {
          ...params,
          per_page,
          page
        };

        eventApi.related_item(params).then((res)=> {
          let {
            data: {
              data: {
                page, next_page, models: _models
              }
            },
          } = res;

          _models = _.map(_models, (item) => {
            item = this.formatItem({item});
            return ({
              ...item
            });
          })

          _models = _.filter(
            _models, (item)=>
              _.findIndex(models, (_item)=> item.id == _item.id) == -1
          );

          models = (page == 1) ? _models : _.concat(models, _models);

          models = _.orderBy(models, ['id'], ['desc']);

          this.page = page;
          this.isLoading = false;
          this.status = _.isNumber(next_page) ? 'more' : 'noMore';
          this.models = models;
        })
      },
      formatItem({ item }) {
        let { timeLine, currentUser } = this;

        let style = item.is_expired ? timeLine.node.styles.expired : timeLine.node.styles[item.status];
        let type = item.is_expired ? timeLine.node.types.expired : timeLine.node.types[item.status];
        let options = [];
        if (item.status == "in_progress") {
          options.push({

            text: '完成',
            style: {
              backgroundColor: '#007aff'
            }
          })
        }
        if (currentUser.id == item.user_id) {
          options.push({
            text: '删除',
            style: {
              backgroundColor: '#dd524d'
            }
          })
        }

        return ({
          ...item,
          title: `${dayjs(item.remind_at).format("YYYY-MM-DD")} 任务`,
          remindAt: dayjs(item.remind_at).format("YYYY-MM-DD hh:mm"),
          createdAt: dayjs(item.created_at).format("YYYY-MM-DD hh:mm"),
          userNames: _.map(item.users, "name").join("、"),
          statusTag: {
            type
          },
          node: {
            style
          },
          swipeAction: {
            options,
            show: false
          }
        })
      },
      doComplate ({id}) {
        let { models } = this;
        eventApi.complate({id}).then((res)=> {
          let {
            data: {
              code, remark, data: item
            },
          } = res;

          if (code == 0) {
            let index = _.findIndex(models, (item)=> item.id == id);
            item = this.formatItem({ item });
            models[index] = item;

            this.models = [...models];
            uni.showToast({
              icon: 'success',
              title: "操作成功",
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
      doDestroy ({id}) {
        let { models } = this;

        eventApi.destroy({id}).then((res)=> {
          let {
            data: {
              code, remark
            },
          } = res;

          if (code == 0) {
            models = _.reject(models, (item)=> item.id == id);
            this.models = models;
            uni.showToast({
              icon: 'success',
              title: "操作成功",
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
      handleLoadMore () {
        let { page, status } = this;
        if (status == "noMore") return;

        page += 1;
        this.fetchListData({page});
      },
      handleSwipeActionOpen (index) {
        let { models } = this;
        models = _.each(models, (item) => {
          item.swipeAction.show = false;
        });
        models[index].swipeAction.show = true;

        this.models = models;
      },
      handleSwipActionClick (item, index, option_index) {
        let { swipeAction: {options = []}, id } = item;
        let opt = options[option_index] || {};

        if (opt.text == "完成") {
          this.doComplate({id});
        }

        if (opt.text == "删除") {
          uni.showModal({
            title: `确定删除该任务？`,
            content: '该操作成功后，将无法恢复。',
            success: (res) => {
              if (res.confirm) {
                this.doDestroy({id});
                return;
              }
            }
          })
        }
      },
    }
  }
</script>

<style>
  .event-list {
    padding-left: 32rpx;
    overflow-y: scroll;
  }

  .u-node {
    width: 44rpx;
    height: 44rpx;
    border-radius: 100rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #d0d0d0;
  }
</style>
