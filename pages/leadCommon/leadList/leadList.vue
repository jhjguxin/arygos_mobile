<template>
  <view class="list">
    <u-tabs :list="leadCommonTabs.list" :is-scroll="true" :current="leadCommonTabs.current" @change="handleLeadCommonChange"></u-tabs>

    <column-filter
      :klassName="klassName" @filterConfirm="handleFilterConfirm"
      @sortColumnChange="handleSortColumnChange"
      storeKey="leadCommon"
      v-show="leadCommonId"
    />
    <column-search :klassName="klassName" @search="handleSearch"/>

    <u-gap></u-gap>
    <uni-list>
      <u-swipe-action
        v-for="(item, index) in list"
        v-bind:key="item.id"
        :show="item.swipeAction.show" :index="index"
        @click="handleSwipActionClick" @open="handleSwipeActionOpen"
        :options="item.swipeAction.options"
      >
        <uni-list-item>
          <u-card
            class="item-body" slot="body" :title="item.company_name"
            :border="card.border" :sub-title="item.name" :full="card.full"
            :show-head="card.showHead" :show-foot="card.showFoot"
            :margin="card.margin"  :padding="card.padding"
            @click="handleItemClick($event, item.id)"
          >
            <u-row slot="body" gutter="10" justify="space-between" v-for="customField in ShowCustomFields" :key="customField.id">
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
            <u-tag :text="item.statusDisplay" v-if="item.statusDisplay"/>
          </u-row>
        </uni-list-item>
      </u-swipe-action>
    </uni-list>
    <u-action-sheet
      :list="uActionSheet.list" v-model="uActionSheet.show"
      @click="handleActionSheet"
    ></u-action-sheet>
    <uni-load-more :status="status" />
    <u-back-top :scroll-top="backTop.scrollTop" top="backTop.top"></u-back-top>
  </view>
</template>

<script>
  import _ from 'lodash';
  import dayjs from 'dayjs';
  import { leadCommonApi } from 'services/http';
  import CustomField from 'services/custom_field';

  export default {
    components: {},
    data() {
      return {
        klassName: "Lead",
        leadCommonTabs: {
          list: [],
          current: 0
        },
        leadCommons: [],
        leadCommonId: null,
        leadCommon: null,
        card: {
          border: false,
          full: true,
          showHead: true,
          showFoot: false,
          margin: "0rpx",
          padding: "10"
        },
        uActionSheet: {
          list: [],
          show: false
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
      let { klassName } = this;
      let customFields = await CustomField.instance().fetchData(klassName);

      this.customFields = customFields;
      this.ShowCustomFields = _(customFields).filter((customField) => {
        return customField.category == "common"
      }).reject((customField) =>
        _.includes(["name", "company_name"], customField.name)
      ).value().slice(0, 5);

      await this.fetchLeadCommons();
      this.fetchLead({reload: true })
    },
    methods: {
      /**
       * 下拉刷新回调函数
       */
      onPullDownRefresh() {
        this.page = 1
        this.fetchLead({ reload: true });
      },
      /**
       * 上拉加载回调函数
       */
      onReachBottom() {
        let { page, status } = this;

        if (status == 'more') {
          page += 1;
          this.page = page;
          this.fetchLead({ page });
        }
      },
      async fetchLeadCommons() {
        let { query: { index = 0 } } = this.$route;
        let res = await leadCommonApi.lead_common_settings();
        let {
          data: {
            code,
            data: {
              models: lead_commons
            }
          },
        } = res;

        if (code == 0) {
          this.leadCommons = lead_commons;
          this.leadCommonTabs.list = _.map(lead_commons, (item)=> (
            {
              name: item.name
            }
          ));
          this.handleLeadCommonChange(index)
        }
      },
      /**
       * 获取页面数据
       * @param {Object} reload 参数reload值为true时执行列表初始化逻辑，值为false时执行追加下一页数据的逻辑。默认为false
       */
      fetchLead({ reload = false, page = 1}) {
        this.status = 'loading';
        let {
          query,
          sort,
          filters,
          list,
          pageSize: per_page,
          searchColumnName: search_column_name,
          leadCommonId: id,
          leadCommon
        } = this;
        if (reload) {
          page = 1;
          list = [];
        }
        uni.showLoading({
          title: '加载中'
        });

        let params = {
          id,
          page, per_page, query, search_column_name, filters, sort
        };

        leadCommonApi.leads({ ...params }).then((res) => {
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

          let swipeActionOptions = leadCommon.is_admin ? [
            {
              text: '删除',
              style: {
                backgroundColor: '#dd524d'
              }
            }
          ] : [];
          const tempList = _.map(_models, (model) => (
            {
              ...model,
              swipeAction: {
                options: swipeActionOptions,
                show: false,
              },
              statusDisplay: model.status_display,
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
      doGrab ({id}) {
        let {
          list,
          leadCommonId
        } = this;
        if (_.isNumber(id)) {
          leadCommonApi.grab({ids: [id], id: leadCommonId}).then((res) => {
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
                title: remark || "获取数据失败",
                duration: 1000
              })
            }
          })
        }
      },
      doDestroy ({id}) {
        let {
          list,
          leadCommonId
        } = this;
        if (_.isNumber(id)) {
          leadCommonApi.mass_destroy({ids: [id], id: leadCommonId}).then((res) => {
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
                title: remark || "获取数据失败",
                duration: 1000
              })
            }
          })
        }
      },
      handleLeadCommonChange (index) {
        let { leadCommons, featureLabels } = this;
        let item = leadCommons[index];

        this.leadCommonId = item?.id;
        this.leadCommon = item;
        this.leadCommonTabs.current = index;

        uni.setNavigationBarTitle({
          title: item?.name
        });

        this.uActionSheet.list = item.is_admin ? [
          {
            text: '转移',
          },
          {
            text: `转移到其他${featureLabels["lead_common"]}`,
          },
        ] : [
          {
            text: '抢',
          }
        ];

        this.fetchLead({reload: true });
      },
      handleItemClick (event, id) {
        this.currentLeadId = id;
        this.uActionSheet.show = true;
      },
      handleActionSheet (index) {
        let { uActionSheet: { list }, leadCommonTabs: { current }, leadCommons, leadCommonId, currentLeadId } = this;
        let item = _.find(leadCommons, (item)=> item.id == leadCommonId);
        console.debug("uActionSheet 点击了", list[index]?.text);

        if (item.is_admin) {
          if (index == 0) {
            let transferUrl = `/pages/common/transferOutCommon/transferOutCommon?ids=${currentLeadId}&klassName=LeadCommon&id=${leadCommonId}&successUrl=/pages/leadCommon/leadList/leadList?index=${current}`;
            uni.navigateTo({
              url: transferUrl
            });
          }
          if (index == 1) {
            let transferToOther = `/pages/common/transferToOther/transferToOther?ids=${currentLeadId}&klassName=LeadCommon&id=${leadCommonId}&successUrl=/pages/leadCommon/leadList/leadList?index=${current}`;
            uni.navigateTo({
              url: transferToOther
            });
          }
          return
        }

        if (item.is_member) {
          if (index == 0) {
            this.doGrab({id: currentLeadId});
          }
          return
        }
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

        this.fetchLead({ reload: true });
      },
      handleSortColumnChange (sort) {
        this.sort = sort;

        this.fetchLead({ reload: true });
      },
      handleFilterConfirm (filters) {
        this.filters = filters;
        this.fetchLead({ reload: true });
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