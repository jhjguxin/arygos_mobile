<template>
  <view class="list">
    <column-filter
      :klassName="klassName" @filterConfirm="handleFilterConfirm"
      @sortColumnChange="handleSortColumnChange"
    />
    <column-search :klassName="klassName" @search="handleSearch"/>

    <u-gap></u-gap>
    <uni-list>
      <u-swipe-action
        v-for="(item, index) in list"
        v-bind:key="item.id"
        :show="item.swipeAction.show" :index="index"
        @click="handleSwipActionClick" @open="handleSwipeActionOpen"
        :options="swipeAction.options"
      >
        <uni-list-item>
          <u-card
            class="item-body" slot="body" :title="item.invoicedDate"
            :border="card.border" :sub-title="item.invoice_no" :full="card.full"
            :show-head="card.showHead" :show-foot="card.showFoot"
            :margin="card.margin"  :padding="card.padding"
            @click="handleItemClick($event, item.id)"
          >
            <u-row slot="body" gutter="10" justify="space-between" v-for="customField in ShowCustomFields" :key="customField.name">
              <u-col span="3" text-align="right" class="u-font-xs">
                {{customField.label}}
              </u-col>
              <u-col span="9">
                <custom-field-on-list :customField="customField" :record="item" />
              </u-col>
            </u-row>
            <u-row slot="foot" gutter="0" justify="space-between">
            </u-row>
          </u-card>

          <u-row class="item-footer" slot="footer" gutter="0" align="center">
            <u-tag :text="item.invoiceTypeDisplay" v-if="item.invoiceTypeDisplay"/>
          </u-row>
        </uni-list-item>
      </u-swipe-action>
    </uni-list>
    <uni-load-more :status="status" />
    <u-back-top :scroll-top="backTop.scrollTop" top="backTop.top"></u-back-top>
  </view>
</template>

<script>
  import _ from 'lodash';
  import dayjs from 'dayjs';
  import { invoicedPaymentApi } from 'services/http';
  import CustomField from 'services/custom_field';

  export default {
    components: {},
    data() {
      return {
        klassName: "InvoicedPayment",
        card: {
          border: false,
          full: true,
          showHead: true,
          showFoot: false,
          margin: "0rpx",
          padding: "10"
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
        list: [], // 列表数据
        ShowCustomFields: [], // 列表页显示字段
        status: 'more', // 加载状态
        backTop: {
          scrollTop: 0,
          top: 600
        }, // 返回顶部
        tipShow: false, // 是否显示顶部提示框
        query: null, // 搜索内容
        searchColumnName: null, // 搜索字段名
        filters: [], // 筛选条件
        sort: [], // 排序字段
        pageSize: 10, // 每页显示的数据条数
        page: 1 ,// 当前页数
        featureLabels: getApp().globalData.featureLabels // 自定义模块名
      };
    },
    async onLoad() {
      let { klassName, featureLabels } = this;
      let customFields = await CustomField.instance().fetchData(klassName);

      this.customFields = customFields;
      this.ShowCustomFields = _(customFields).filter((customField) => {
        return customField.category == "common"
      }).reject((customField) =>
        _.includes(["invoiced_date", "invoice_type", "invoice_no"], customField.name)
      ).value().slice(0, 5);

      uni.setNavigationBarTitle({
        title: featureLabels["invoiced_payment"]
      });

      // 初始化页面数据
      this.fetchInvoicedPayment({reload: true });
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
        this.fetchInvoicedPayment({ reload: true });
      },
      /**
       * 上拉加载回调函数
       */
      onReachBottom() {
        let { page, status } = this;

        if (status == 'more') {
          page += 1;
          this.page = page;
          this.fetchInvoicedPayment({ page });
        }
      },
      /**
       * 获取页面数据
       * @param {Object} reload 参数reload值为true时执行列表初始化逻辑，值为false时执行追加下一页数据的逻辑。默认为false
       */
      fetchInvoicedPayment({ reload = false, page = 1}) {
        this.status = 'loading';
        let {
          query,
          sort,
          filters,
          list,
          pageSize: per_page,
          searchColumnName: search_column_name
        } = this;
        if (reload) {
          page = 1;
          list = [];
        };
        uni.showLoading({
          title: '加载中'
        });

        invoicedPaymentApi.index({ page, per_page, query, search_column_name, filters, sort }).then((res) => {
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

          const tempList = _.map(_models, (model) => (
            {
              ...model,
              swipeAction: {
                show: false,
              },
              invoicedDate: dayjs(model.invoiced_date).format("YYYY-MM-DD"),
              invoiceTypeDisplay: model.invoice_type_display,
              createAt: dayjs(model.created_at).format("MM-DD HH:ss")
            }
          ));

          if (next_page) {
            this.status = 'more';
          } else {
            this.status = 'noMore';
          }

          if (reload) {
            // 停止刷新
            uni.stopPullDownRefresh();
          }

          this.list = list.concat(tempList);
        })

      },
      doDestroy ({id}) {
        let { list } = this;
        if (_.isNumber(id)) {
          invoicedPaymentApi.mass_destroy({ids: [id]}).then((res) => {
            let { data: {code, remark}} = res;
            let index = _.findIndex(list, (item)=> item.id == id);

            if (code == 0) {
              list.splice(index, 1);
              this.list = list;

              uni.showToast({
                icon: 'success',
                title: '操作成功',
                duration: 1000
              });
            } else {
              uni.showToast({
                icon: 'none',
                title: remark || "操作失败",
                duration: 1000
              })
            }
          })
        }
      },
      handleItemClick (event, id) {
        let url = `/pages/invoicedPayment/invoicedPaymentShow/invoicedPaymentShow?id=${id}`
        uni.navigateTo({
          url
        });
      },
      handleSwipeActionOpen (index) {
        let { list } = this;
        list = _.each(list, (item) => {
          item.swipeAction.show = false;
        });
        list[index].swipeAction.show = true;

        this.list = list;
      },
      handleSwipActionClick (index, option_index) {
        if (option_index === 0) {
          let { list } = this;
          let id = list[index]?.id;
          this.doDestroy({id})
        }
      },
      handleSearch ({query, searchColumnName }) {
        this.query = query;
        this.searchColumnName = searchColumnName;

        this.fetchInvoicedPayment({ reload: true });
      },
      handleSortColumnChange (sort) {
        this.sort = sort;

        this.fetchInvoicedPayment({ reload: true });
      },
      handleFilterConfirm (filters) {
        this.filters = filters;
        this.fetchInvoicedPayment({ reload: true });
      }
    }
  };
</script>

<style>
  .item-body {
    width: 580rpx;
  }
  .item-footer {
    width: 120rpx;
  }
</style>