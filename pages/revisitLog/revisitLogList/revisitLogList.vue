<template>
  <view>
    <revisit-log-column-filter
      :klassName="klassName" @filterConfirm="handleFilterConfirm"
      @sortColumnChange="handleSortColumnChange"
    />
    <!-- 跟进内容搜索 -->
    <u-row gutter="16" justify="center">
      <u-col span="11">
        <u-search
          :placeholder="search.placeholder" v-model="query"
          :show-action="search.showAction"
          :clearable="search.clearable"
          @search="handleSearch"
          @clear="handleSearch"
        ></u-search>
      </u-col>
    </u-row>
    <u-gap></u-gap>
    <view class="revisit-log-list">
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
                <view class="u-order-desc u-font-sm">{{item.content}}</view>
                <view class="u-order-desc u-font-sm ">提醒时间：{{item.remindAt}}</view>
                <view class="u-order-desc u-font-sm">跟进时间：{{item.revisitAt}}</view>
                <view class="u-order-desc u-font-sm" v-if="item.contactNames.length > 0">{{featureLabels.contact}}：{{item.contactNames}}</view>
                <view class="u-order-desc u-font-sm u-padding-5 u-flex" v-if="item.image_attachments.length > 0">
                  <u-image
                    :src="attachment.file_url"
                    width="150rpx" height="150rpx"
                    mode="aspectFit"
                    @click="handleItemClick($event, attachment)"
                    v-for="attachment in item.image_attachments"
                    :key="attachment.id"
                  ></u-image>
                </view>
                <view class="u-order-desc u-font-sm u-padding-5" v-if="item.file_attachments.length > 0">
                 <u-row v-for="attachment in item.file_attachments"
                 :key="attachment.id">
                   <u-col span="10" @click="handleItemClick($event, attachment)">{{attachment.name}}</u-col>
                   <u-col span="2">
                     {{attachment.fileSize}}
                   </u-col>
                 </u-row>
                </view>
                <view class="u-order-desc u-font-sm">来自：
                  <text
                    v-if="item.sales_activity.refer_url" style="color: #2979ff;"
                    @tap.stop="handleReferNameClick($event, item.sales_activity.refer_url)"
                  >
                    {{item.sales_activity.refer_name}}
                  </text>
                  <text v-else>
                    {{item.sales_activity.refer_name}}
                  </text>
                </view>
              </view>
              <u-row slot="foot">
                <u-col span="4">
                  <u-icon
                    name="chat-fill" size="24" :label="item.sales_activity.commentCount"
                    @click="handleCommentCountClick($event, item)"
                  ></u-icon>
                  <sales-activity-comment-list
                    @close="handleCommentListClose($event, item)"
                    :sales_activity_id="item.sales_activity.id" :ref="item.sales_activity.commentListRef"
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
      <u-back-top :scroll-top="backTop.scrollTop" top="backTop.top"></u-back-top>
    </view>
  </view>
</template>

<script>
  import _ from 'lodash';
  import dayjs from 'dayjs';
  import prettyBytes from 'pretty-bytes';
  import mime from 'mime-types';
  import { revisitLogApi } from 'services/http';
  import CustomField from 'services/custom_field';

  export default {
    components: {},
    data() {
      return {
        klassName: "RevisitLog",
        timeLine: {
          card: {
            border: true,
            margin: "0 20rpx",
            padding: 20,
            showFoot: true
          }
        },
        loadText: {
          contentdown: '点击加载更多',
          contentrefresh: '加载中',
          contentnomore: '没有更多数据了'
        },
        search: {
          placeholder: "输入搜索内容",
          showAction: false,
          clearable: true
        },
        models: [], // 列表数据
        status: 'more', // 加载状态
        backTop: {
          scrollTop: 0,
          top: 600
        }, // 返回顶部
        query: null, // 搜索内容
        searchColumnName: "content", // 搜索字段名
        filters: [], // 筛选条件
        sort: [], // 排序字段
        pageSize: 10, // 每页显示的数据条数
        page: 1 ,// 当前页数
        featureLabels: getApp().globalData.featureLabels // 自定义模块名
      };
    },
    async onLoad() {
      uni.setNavigationBarTitle({
        title: this.featureLabels["revisit_log"]
      });

      // 初始化页面数据
      this.fetchRevisitLog({reload: true });
    },
    methods: {
      onBackPress() {
        uni.switchTab({
          url: "/pages/workbench/workbench"
        })
        return true;
      },
      /**
       * 下拉刷新回调函数
       */
      onPullDownRefresh() {
        this.page = 1
        this.fetchRevisitLog({ reload: true });
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
          this.fetchRevisitLog({ page });
        }
      },
      /**
       * 获取页面数据
       * @param {Object} reload 参数reload值为true时执行列表初始化逻辑，值为false时执行追加下一页数据的逻辑。默认为false
       */
      fetchRevisitLog({ reload = false, page = 1}) {
        this.status = 'loading';
        let {
          query,
          sort,
          filters,
          models,
          pageSize: per_page,
          searchColumnName: search_column_name
        } = this;
        if (reload) {
          page = 1;
          models = [];
        };
        uni.showLoading({
          title: '加载中'
        });

        revisitLogApi.index({ page, per_page, query, search_column_name, filters, sort }).then((res) => {
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
            const urlMap = {
              Lead: `/pages/lead/leadShow/leadShow?id=${item.sales_activity.refer_id}`,
              Customer: `/pages/customer/customerShow/customerShow?id=${item.sales_activity.refer_id}`,
              Contact: `/pages/contact/contactShow/contactShow?id=${item.sales_activity.refer_id}`,
              Opportunity: `/pages/opportunity/opportunityShow/opportunityShow?id=${item.sales_activity.refer_id}`,
              Contract: `/pages/contract/contractShow/contractShow?id=${item.sales_activity.refer_id}`,
            };

            return {
              ...item,
              contactNames: (_.map(item.contacts, "name")).join("，"),
              remindAt: item.remind_at ? dayjs(item.remind_at).format("YYYY-MM-DD HH:mm") : null,
              revisitAt: dayjs(item.revisit_at).format("YYYY-MM-DD HH:mm"),
              createdAt: dayjs(item.created_at).format("YYYY-MM-DD HH:mm"),
              file_attachments: _.map(item.file_attachments, (attachment)=> {
                return ({
                  ...attachment,
                  createdAt: dayjs(attachment.created_at).format("YYYY-MM-DD HH:mm"),
                  fileSize: prettyBytes(attachment.file_file_size)
                })
              }),
              sales_activity: {
                ...item.sales_activity,
                refer_url: urlMap[item.sales_activity.refer_type],
                commentCount: `评论（${item.sales_activity.comments_count}）`,
                commentListRef: `sales-activity-comment-models-${item.sales_activity.id}`
              },
              node: {
                style: "background: green"
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
      handleCommentCountClick (event, item) {
        let { sales_activity: {commentListRef} } = item;
        let { [`${commentListRef}`]: commentList } = this.$refs;

        // REVIEW v-for Array Refs
        commentList[0].pop();
      },
      handleCommentListClose (count, item) {
        let { models } = this;

        let index = _.findIndex(models, (_item)=> _item.id == item.id);

        if (index == -1) return;

        item.sales_activity = {
          ...item.sales_activity,
          comments_count: count,
          commentCount: `评论（${count}）`
        };
        models[index] = item;

        this.models = models;
      },
      handleSearch (value) {
        this.query = value;

        this.fetchRevisitLog({ reload: true });
      },
      handleSortColumnChange (sort) {
        this.sort = sort;

        this.fetchRevisitLog({ reload: true });
      },
      handleFilterConfirm (filters) {
        this.filters = filters;
        this.fetchRevisitLog({ reload: true });
      },
      handleReferNameClick(e, url) {
        e.stopPropagation();

        uni.navigateTo({
          url
        })
      },
      handleItemClick (event, item) {
        let { file_url: filePath, file_content_type } = item;

        uni.showLoading({
            title: '文件下载中'
        });

        uni.downloadFile({
          url: encodeURI(filePath),
          success(res) {
            uni.hideLoading();

            let isImage = _.startsWith(file_content_type, "image/");
            const documentExts = [
              "doc", "xls", "ppt", "pdf", "docx", "xlsx", "pptx"
            ];
            let isDocument = _.includes(
              documentExts, mime.extension(file_content_type)
            );

            if (isImage) {
              uni.previewImage({
                urls: [res.tempFilePath]
              });
            } else if (isDocument){
              uni.openDocument({
                filePath: res.tempFilePath,
                fail(e) {
                  uni.hideLoading();
                  uni.showToast({
                    icon: 'none',
                    title: '文件打开失败！'
                  });
                }
              });
            } else {
              uni.saveFile({});
            }
          },
          fail() {
            uni.hideLoading();
            uni.showToast({
              icon: 'none',
              title: '附件下载出错！'
            });
          },
          complete() {
            uni.hideLoading();
          }
        });

      }
    }
  };
</script>

<style>
  .revisit-log-list {
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