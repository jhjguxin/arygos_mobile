<template>
  <view class="product-asset-list-on-show"  :style="style">
    <view
      v-for="item in models":key="item.id">
      <u-card
        :title="item.product.name"
        :border="card.border" :sub-title="item.product.no" :full="card.full"
        :show-head="card.showHead" :show-foot="card.showFoot"
        :margin="card.margin"  :padding="card.padding"
        @click="handleItemClick($event, item)"
      >
        <u-row slot="body" gutter="10" justify="space-between" v-for="customField in customFields" :key="customField.id">
          <u-col span="3" text-align="left">
            {{customField.label}}
          </u-col>
          <u-col span="9" class="u-padding-left-20">
            <custom-field-on-list :customField="customField" :record="item" />
          </u-col>
        </u-row>
      </u-card>
    </view>
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
  import { opportunityApi } from 'services/http';
  import CustomField from 'services/custom_field';

  export default {
    data() {
      let { style = "height: 55vh;"} = this.$attrs;
      let featureLabels = getApp().globalData.featureLabels;

      return {
        style,
        models: [],
        status: 'more', // 加载状态
        page: 1,
        perPage: 8, // 分页数
        uEmpty: {
          text: `${featureLabels["product"]}为空`
        },
        card: {
          border: false,
          full: true,
          showHead: true,
          showFoot: false,
          margin: "30rpx",
          padding: "20"
        },
        loadText: {
          contentdown: '点击加载更多',
          contentrefresh: '加载中',
          contentnomore: '没有更多数据了'
        },
        customFields: [
          {
            name: "quantity",
            label: "数量",
            field_type: "float_field",
            custom_column_name: "quantity"
          },
          {
            name: "standard_unit_price",
            label: "标准单价",
            field_type: "currency_field",
            custom_column_name: "standard_unit_price"
          },
          {
            name: "recommended_unit_price",
            label: "建议价格",
            field_type: "currency_field",
            custom_column_name: "recommended_unit_price"
          },
          {
            name: "remark",
            label: "备注",
            field_type: "text_area",
            custom_column_name: "remark"
          }
        ],
      };
    },
    async mounted() {
      this.fetchListData({});
    },
    methods: {
      fetchListData ({ page, reload }) {
        let { params } = this.$attrs;
        let { perPage: per_page, models = [] } = this;

        if (reload) {
          page = 1;
        }

        params = {
          ...params,
          per_page,
          page
        };

        opportunityApi.product_assets(params).then((res)=> {
          let {
            data: {
              data: {
                page, next_page, models: _models
              }
            },
          } = res;

          _models = _.map(_models, (item) => {
            return ({
              ...item,
              createdAt: dayjs(item.created_at).format("YYYY-MM-DD hh:mm"),
              url: `/pages/product/productShow/productShow?id=${item.product_id}`
            })
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
      handleLoadMore () {
        let { page, status } = this;
        if (status == "noMore") return;

        page += 1;
        this.fetchListData({page});
      },
      handleItemClick (event, item) {
        let { url } = item;
        uni.navigateTo({
          url
        });
      }
    }
  }
</script>

<style>
  .product-asset-list-on-show {
    padding-left: 32rpx;
    overflow-y: scroll;
  }
  .item-body {
    width: 600rpx;
  }
  .item-footer {
    width: 0rpx;
  }
</style>