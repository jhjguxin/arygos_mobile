<template>
 <view>
  <u-card
    full
    :title="model.title"
    :sub-title="model.createdAt"
    :margin="card.margin"
    :padding="card.padding"
    :show-foot="card.showFoot"
    :border="card.border"
    v-if="model"
    class="u-m-t-10 u-m-b-10"
  >
    <u-row slot="body" class="u-p-l-10 u-p-r-10">
      <view class="article-content">
        <rich-text :nodes="model.content"></rich-text>
      </view>

      <u-row class="u-m-t-20 u-font-sm u-border-top u-border-bottom" style="width: 100%">
        <u-col span="12">
          附件:
          <u-link
            :href="item.file_url"
            v-for="(item, index) in (model.attachments)"
            class="u-m-r-10 u-m-l-10"
            :index="index"
          >{{item.file_file_name}}</u-link>
        </u-col>
        <u-col span="12" class="u-m-t-10">
          标签:
          <u-tag
            :text="tag"
            v-for="tag in (model.tags)"
            class="u-m-r-10 u-m-l-10"
          ></u-tag>
        </u-col>
      </u-row>

      <u-row class="u-m-t-20 u-font-xs "style="width: 100%">
        <u-col span="6">
          创建时间：{{model.createdAt}}
        </u-col>
        <u-col span="6">
          更新时间：{{model.updatedAt}}
        </u-col>
      </u-row>
    </u-row>
    <view slot="foot">
      <u-row gutter="10" class="u-font-sm">
        <u-col span="4">
          版块: {{model.knowledge_section.name}}
        </u-col>
        <u-col span="4">
          阅读: {{model.views}}
        </u-col>
        <u-col span="4">
          发布人: {{model.user.name}}
        </u-col>
      </u-row>
    </view>
  </u-card>
 </view>
</template>

<script>
  import _ from 'lodash';
  import dayjs from 'dayjs';
  import { knowledgeArticleApi } from 'services/http';

 export default {
  data() {
    let { query: {id} } = this.$route;

    return {
      id,
      model: null,
      card: {
        border: true,
        margin: "0 20rpx",
        padding: 20,
        showFoot: true
      }
    }
  },
  async onLoad() {
    let model = await this.fetchKnowledgeArticleShow();
    this.model = model;

    if (model) {
      _.delay(()=> {
        this.handleUpdateViews()
      }, 2000)
    }

    uni.setNavigationBarTitle({
      title: model.title || "文章详情"
    });
  },
  methods: {
    async fetchKnowledgeArticleShow() {
      let { id } = this;

      let res = await knowledgeArticleApi.show({id});
      let {
        data: {
          code, remark, data: model
        }
      } = res;

      _.delay(()=>{
        uni.hideLoading();
      }, 100);

      if (code == 0) {
        model = {
          ...model,
          title: model.sticky_at ? `[置顶]${model.title}` : model.title,
          tagsName: model.tags.join(", "),
          createdAt: dayjs(model.created_at).format("YYYY-MM-DD HH:mm"),
          updatedAt: dayjs(model.updated_at).format("YYYY-MM-DD HH:mm")
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
    handleUpdateViews() {
      let { id } = this;
      knowledgeArticleApi.update_views({ id });
    },
  }
}
</script>

<style>
  .article-content {
    width: 100%;
    margin-bottom: 10rpx;
    overflow: scroll;
  }
</style>
