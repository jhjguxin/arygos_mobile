<template>
  <view class="sales-activity-list" :style="style">
    <u-time-line class="timeLine">
      <u-time-line-item nodeTop="2" v-for="item in models" :key="item.id">
        <!-- 此处自定义了左边内容，用一个图标替代 -->
        <template v-slot:node>
          <view class="u-node" :style="item.node.style">
            <!-- 此处为uView的icon组件 -->
            <u-icon name="map-fill" color="#fff" :size="24"></u-icon>
          </view>
        </template>
        <template v-slot:content>
          <u-card
            full
            :title="item.user.name"
            :sub-title="item.createdAt"
            :margin="timeLine.card.margin"
            :padding="timeLine.card.padding"
            :show-foot="timeLine.card.showFoot"
            :border="timeLine.card.border"
            :thumb="item.user.avatar_url"
          >
            <view slot="body">
              <view class="u-order-desc">{{item.description}}</view>
              <view class="u-order-desc">来自：
                <text
                  v-if="item.refer_url" style="color: #2979ff;"
                  @tap.stop="handleReferNameClick($event, item.refer_url)"
                >
                  {{item.refer_name}}
                </text>
                <text v-else>
                  {{item.refer_name}}
                </text>
              </view>
            </view>
            <u-row slot="foot">
              <u-col span="4">
                <u-icon
                  name="chat-fill" size="24" :label="item.commentCount"
                  @click="handleCommentCountClick($event, item)"
                ></u-icon>
                <sales-activity-comment-list
                  @close="handleCommentListClose($event, item)"
                  :sales_activity_id="item.id" :ref="item.commentListRef"
                />
              </u-col>
            </u-row>
          </u-card>
        </template>
      </u-time-line-item>
    </u-time-line>
    <uni-load-more
      :status="status" :contentText="loadText"
      @clickLoadMore="handleLoadMore"
      v-if="models.length > 0" />
  </view>
</template>

<script>
  import _ from 'lodash';
  import dayjs from 'dayjs';
  import { salesActivityApi } from 'services/http';

  export default {
    data() {
      let { style = "height: 55vh;"} = this.$attrs;
      return {
        models: [],
        isLoading: true,
        category: "all",
        status: 'more', // 加载状态
        perPage: 5, // 分页数
        style,
        timeLine: {
          card: {
            border: true,
            margin: "0 20rpx",
            padding: 20,
            showFoot: true
          },
          node: {
            styles: {
              create: "background: green",
              update: "background: green",
              destroy: "background: red",
              turn_common: "background: blue",
              remove_assist_user: "background: blue",
              create_assist_user: "background: blue",
              take_common: "background: blue",
              transfer_common: "background: blue",
              turn: "background: blue",
              approved: "background: blue",
              rejected: "background: red",
              negated: "background: gray"
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
      this.fetchListData();
    },
    methods: {
      fetchListData (page = 1) {
        let { category, models, timeLine, perPage } = this;
        let { params = {} } = this.$attrs;
        params.page = page;
        params.per_page = perPage;
        params.category = category;

        this.isLoading = true;
        salesActivityApi.index(params).then((res)=> {
          let {
            data: {
              data: {
                next_page, models: _models
              }
            },
          } = res;

          _models = _.map(_models, (item) => {
            const urlMap = {
              Lead: `/pages/lead/leadShow/leadShow?id=${item.refer_id}`,
              Customer: `/pages/customer/customerShow/customerShow?id=${item.refer_id}`,
              Contact: `/pages/contact/contactShow/contactShow?id=${item.refer_id}`,
              Opportunity: `/pages/opportunity/opportunityShow/opportunityShow?id=${item.refer_id}`,
              Contract: `/pages/contract/contractShow/contractShow?id=${item.refer_id}`,
            };

            return ({
              ...item,
                refer_url: urlMap[item.refer_type],
              createdAt: dayjs(item.created_at).format("YYYY-MM-DD HH:mm"),
              commentCount: `评论（${item.comments_count}）`,
              commentListRef: `sales-activity-comment-list-${item.id}`,
              node: {
                style: timeLine.node.styles[item.activity_type]
              }
            })
          })

          _models = _.filter(
            _models, (item)=>
              _.findIndex(models, (_item)=> item.id == _item.id) == -1
          );

          models = _.concat(models, _models);

          models = _.orderBy(models, ['id'], ['desc']);

          this.page = page;
          this.isLoading = false;
          this.status = _.isNumber(next_page) ? 'more' : 'noMore';
          this.models = models;
        })
      },
      handleLoadMore () {
        let { page, status } = this;
        if (status == "noMore") return;

        page += 1;
        this.fetchListData(page);
      },
      handleCommentCountClick (event, item) {
        let { commentListRef } = item;
        let { [`${commentListRef}`]: commentList } = this.$refs;

        // REVIEW v-for Array Refs
        commentList[0].pop();
      },
      handleCommentListClose (count, item) {
        let { models } = this;

        let index = _.findIndex(models, (_item)=> _item.id == item.id);

        if (index == -1) return;

        item = {
          ...item,
          comments_count: count,
          commentCount: `评论（${count}）`
        };
        models[index] = item;

        this.models = models;
      },
      handleReferNameClick(e, url) {
        e.stopPropagation();

        uni.navigateTo({
          url
        })
      }
    }
  }
</script>

<style>
  .sales-activity-list {
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
