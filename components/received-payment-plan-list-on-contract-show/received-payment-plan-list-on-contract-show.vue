<template>
  <view class="received-payment-plan-list-on-show"  :style="style">
    <view
      v-for="item in models":key="item.id">
      <u-card
        :title="item.receive_stage_display"
        :border="card.border" :sub-title="item.receiveDate" :full="card.full"
        :show-head="card.showHead" :show-foot="card.showFoot"
        :margin="card.margin"  :padding="card.padding"
        @click="handleItemClick($event, item)"
      >
        <u-row slot="body" gutter="10" justify="space-between" v-for="customField in customFields" :key="customField.name">
          <u-col span="3" text-align="right" class="u-font-xs">
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
  import { contractApi } from 'services/http';
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
          text: `${featureLabels["received_payment_plan"]}为空`
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
        customFields: []
      };
    },
    async mounted() {
      let customFields = await CustomField.instance().fetchData("ReceivedPaymentPlan");
      const customFieldNames = [
        "amount", "received_amount",
        "unreceived_amount",
        "status"
      ];
      this.customFields = _.compact(_.map(customFieldNames, (customFieldName)=>
        _.find(customFields, (customField)=> customField.name == customFieldName)
      ));
      this.fetchListData({});
    },
    methods: {
      fetchListData ({ page, reload }) {
        let { params } = this.$attrs;
        let { perPage: per_page, models = [] } = this;

        if (reload) {
          page = 1;
          models = [];
        }

        params = {
          ...params,
          per_page,
          page
        };

        contractApi.received_payment_plans(params).then((res)=> {
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
              receiveDate: dayjs(item.receive_date).format("YYYY-MM-DD"),
              createdAt: dayjs(item.created_at).format("YYYY-MM-DD HH:mm"),
              url: `/pages/receivedPaymentPlan/receivedPaymentPlanShow/receivedPaymentPlanShow?id=${item.id}`
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
  .received-payment-plan-list-on-show {
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