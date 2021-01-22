<template>
  <view>
    <knowledge-article-column-filter
      :klassName="klassName" @filterConfirm="handleFilterConfirm"
      @sortColumnChange="handleSortColumnChange"
    />
    <view class="knowledge-article-list">
      <u-card
        full
        :title="item.title"
        :sub-title="item.createdAt"
        :margin="card.margin"
        :padding="card.padding"
        :show-foot="card.showFoot"
        :border="card.border"
        v-for="(item, index) in models"
        :key="item.id"
        class="u-m-t-10 u-m-b-10"
        @click="handleCardClick($event, item)"
      >
        <u-row slot="body" class="u-flex u-line-5">
          <u-col span="8" class="u-line-5">
          {{item.summary}}
          </u-col>
          <u-col span="4">
            <u-image
              width="100%" height="200rpx"
              mode="aspectFit"
              :src="item.thumb"
              v-if="item.thumb"
            ></u-image>
          </u-col>
        </u-row>
        <u-row gutter="10" slot="foot">
          <u-col span="4">
            <u-icon
              name="bookmark" :label="item.knowledge_section.name"
            ></u-icon>
          </u-col>
          <u-col span="2">
            <u-icon
              name="heart" :label="item.views"
            ></u-icon>
          </u-col>
          <u-col span="4">
            <u-icon
              name="account" :label="item.user.name"
            ></u-icon>
          </u-col>
          <u-col span="8">
            <u-icon
              name="tags" :label="item.tagsName"
            ></u-icon>
          </u-col>
        </u-row>
      </u-card>
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
  import dayjs from 'dayjs';
  import _ from "lodash";
  import { knowledgeArticleApi } from 'services/http';

  export default {
    data() {
      return {
        klassName: "KnowledgeArticle",
        card: {
          border: true,
          margin: "0 20rpx",
          padding: 20,
          showFoot: true
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
        searchColumnName: "title", // 搜索字段名
        tag: null, // 标签名
        knowledge_section_id: null, // 所属版块
        sort: [], // 排序字段
        pageSize: 10, // 每页显示的数据条数
        page: 1 ,// 当前页数
        featureLabels: getApp().globalData.featureLabels // 自定义模块名
      };
    },
    async onLoad() {
      uni.setNavigationBarTitle({
        title: this.featureLabels["knowledge_article"]
      });

      // 初始化页面数据
      this.fetchKnowledgeArticle({reload: true });
    },
    methods: {
      /**
       * 下拉刷新回调函数
       */
      onPullDownRefresh() {
        this.page = 1
        this.fetchKnowledgeArticle({ reload: true });
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
          this.fetchKnowledgeArticle({ page });
        }
      },
      fetchKnowledgeArticle({ reload = false, page = 1}) {
        this.status = 'loading';

        let {
          query, tag, knowledge_section_id, sort,
          models
        } = this;

        if (reload) {
          page = 1;
          models = [];
        };

        let params = {
          query, tag, knowledge_section_id, sort
        }
        uni.showLoading({
          title: '加载中'
        });

        knowledgeArticleApi.index(params).then((res) => {
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

            return {
              ...item,
              title: item.sticky_at ? `[置顶]${item.title}` : item.title,
              tagsName: item.tags.join(", "),
              thumb:  (item.image_urls || [])[0],
              createdAt: dayjs(item.created_at).format("YYYY-MM-DD HH:mm")
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
      handleFilterConfirm({tag, knowledge_section_id}) {
        this.tag = tag;
        this.knowledge_section_id = knowledge_section_id;

        this.fetchKnowledgeArticle({ reload: true });
      },
      handleSortColumnChange(sort) {
        this.sort = sort;

        this.fetchKnowledgeArticle({ reload: true });
      },
      handleCardClick(e, item) {
        let url = `/pages/wiki/knowledgeArticleShow/knowledgeArticleShow?id=${item.id}`;

        uni.navigateTo({
          url
        })
      },
    }
  }
</script>

<style>

</style>
