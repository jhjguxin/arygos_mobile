<template>
  <view class="list">
    <u-tabs :list="approvalTabs.list" :is-scroll="true" :current="approvalTabs.current" @change="handleTabChange"></u-tabs>
    <u-dropdown ref="uDropdown">
      <u-dropdown-item v-model="approvableType" title="模块" :options="approvableTypeList" @change="handleApprovableTypeChange"></u-dropdown-item>
      <u-dropdown-item title="条件筛选">
        <view class="slot-content u-cell-item-box">
          <approval-list-filter :filters="filters" @filterConfirm="handleFilterConfirm"></approval-list-filter>
        </view>
      </u-dropdown-item>
    </u-dropdown>

    <u-gap></u-gap>
    <uni-list v-if="!allModuleDisable">
      <uni-list-item
        v-for="(item, index) in list"
        v-bind:key="item.id"
        :index="index"
      >
        <u-card
          class="item-body" slot="body" :title="item.approvable.name"
          :border="card.border" :sub-title="item.applier.name" :full="card.full"
          :show-head="card.showHead" :show-foot="card.showFoot"
          :margin="card.margin"  :padding="card.padding"
          @click="handleItemClick($event, item)"
        >
          <view slot="body">
            <u-row gutter="10" v-if="approvalTabs.current == 0">
              <u-col span="3" text-align="right" class="u-font-xs">
                层级
              </u-col>
              <u-col span="9">
                {{String(item.step) == '0' ? '待1级审批' : `${item.step}级`}}
              </u-col>
              <u-col span="3" text-align="right" class="u-font-xs">
                提交时间
              </u-col>
              <u-col span="9">
                {{item.submitApplyingAt}}
              </u-col>
            </u-row>
            <u-row gutter="10" v-if="approvalTabs.current == 1">
              <u-col span="3" text-align="right" class="u-font-xs">
                审批状态
              </u-col>
              <u-col span="9">
                {{item.approve_status_i18n}}
              </u-col>
              <u-col span="3" text-align="right" class="u-font-xs">
                提交时间
              </u-col>
              <u-col span="9">
                {{item.submitApplyingAt}}
              </u-col>
              <u-col span="3" text-align="right" class="u-font-xs">
                审批完成时间
              </u-col>
              <u-col span="9">
                {{item.finishApproveAt}}
              </u-col>
            </u-row>
          </view>
          <view slot="foot">
          </view>
        </u-card>

        <u-row class="item-footer" slot="footer" gutter="0" align="center">
          <u-tag :text="item.approveStatusDisplay" v-if="item.approveStatusDisplay"/>
        </u-row>
      </uni-list-item>
    </uni-list>
    <uni-load-more :status="status" v-if="!allModuleDisable" />
    <u-back-top :scroll-top="backTop.scrollTop" top="backTop.top" v-if="! allModuleDisable"></u-back-top>
    <u-empty v-if="allModuleDisable" text="没有开启审批的模块，审批不可用" mode="list"></u-empty>

  </view>
</template>

<script>
  import _ from 'lodash';
  import dayjs from 'dayjs';
  import { approvalApi } from 'services/http';
  import CustomField from 'services/custom_field';
  import ApprovalSetting from 'services/approval_setting';
  import Feature from 'services/feature';

  export default {
    components: {},
    data() {
      return {
        allModuleDisable: false,
        approvalTabs: {
          list: [
            {
              name: "待审批"
            },
            {
              name: "已审批"
            }
          ],
          current: 0
        },
        approvableTypeList: [],
        approvableType: null,
        user_id: null,
        filters: {},
        card: {
          border: false,
          full: true,
          showHead: true,
          showFoot: false,
          margin: "0rpx",
          padding: "10"
        },
        list: [], // 列表数据
        status: 'more', // 加载状态
        backTop: {
          scrollTop: 0,
          top: 600
        }, // 返回顶部
        sort: [], // 排序字段
        pageSize: 10, // 每页显示的数据条数
        page: 1 ,// 当前页数
        featureLabels: getApp().globalData.featureLabels // 自定义模块名
      };
    },
    async onLoad(options) {
      let { index = 0 } = options;
      let { featureLabels } = this;

      const feature = await Feature.instance()
      let approval_setting = await ApprovalSetting.instance();
      let approval_setting_config = approval_setting.approval_setting_config;

      let model_names = [
        'Contract', 'ReceivedPayment', 'Opportunity'
      ];
      model_names = _.filter(model_names, (name) => (feature.isEnable({ name: _.snakeCase(name) })));
      model_names = _.filter(model_names, (name) => (approval_setting.isEnable({ name: _.snakeCase(name)})));

      this.approvableTypeList = _.map(model_names, (modelName)=> (
        {
          label: featureLabels[_.snakeCase(modelName)],
          value: modelName
        }
      ));
      this.approvableType = _.first(model_names);

      let allModuleDisable = _.every(model_names, (name) => !approval_setting.isEnable({ name: _.snakeCase(name) }));

      if (allModuleDisable) {
        this.allModuleDisable = allModuleDisable;
      } else {
        this.fetchApproval({reload: true })
      }
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
        this.fetchApproval({ reload: true });
      },
      /**
       * 上拉加载回调函数
       */
      onReachBottom() {
        let { page, status } = this;

        if (status == 'more') {
          page += 1;
          this.page = page;
          this.fetchApproval({ page });
        }
      },
      /**
       * 获取页面数据
       * @param {Object} reload 参数reload值为true时执行列表初始化逻辑，值为false时执行追加下一页数据的逻辑。默认为false
       */
      fetchApproval({ reload = false, page = 1}) {
        this.status = 'loading';
        
        let {
          approvalTabs: { current },
          approvableType,
          user,
          list,
          pageSize: per_page,
        } = this;
        if (reload) {
          page = 1;
          list = [];
        };
        uni.showLoading({
          title: '加载中'
        });
        
        let apiName = "applying_list"
        if (current == 1) apiName = "approved_list";

        let params = {
          approvable_type: approvableType,
          page, per_page
        };
        if (!_.isNil(user)) params["user_id"] = user.value;

        approvalApi[apiName]({ ...params }).then((res) => {
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
              approveStatusDisplay: model.approve_status_i18n,
              submitApplyingAt: model.submit_applying_at ?  dayjs(model.submit_applying_at).format("YYYY-MM-DD HH:ss") : null,
              finishApproveAt: model.finish_approve_at ?  dayjs(model.submit_applying_at).format("YYYY-MM-DD HH:ss") : null,
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
      handleTabChange (index) {
        let { approvalTabs } = this;

        approvalTabs.current = index;
        this.approvalTabs = approvalTabs;

        this.fetchApproval({reload: true });
      },
      handleApprovableTypeChange (value) {
        this.approvableType = value;
        _.delay(()=> {
          this.fetchApproval({reload: true });
        }, 50)
      },
      handleFilterConfirm(filters) {
        this.user = filters.user;

        _.delay(()=> {
          this.$refs.uDropdown.close();
          this.fetchApproval({reload: true });
        }, 50)
      },
      handleItemClick (event, item) {
        let { approvable_type, approvable_id } = item;
        let url =  `/pages/approval/approvalDetail/approvalDetail?approvable_id=${approvable_id}&approvable_type=${approvable_type}`;
        
        
        uni.navigateTo({
          url
        });
      }
    }
  };
</script>

<style>
  .item-body {
    width: 80vw;
  }
  .item-footer {
    width: 20vw;
  }

  .slot-content {
    background-color: #FFFFFF;
    padding: 24rpx;

    .item-box {
      margin-bottom: 50rpx;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      .item {
        border: 1px solid $u-type-primary;
        color: $u-type-primary;
        padding: 8rpx 40rpx;
        border-radius: 100rpx;
        margin-top: 30rpx;
      }

      .active {
        color: #FFFFFF;
        background-color: $u-type-primary;
      }
    }
  }
  .u-cell-item-box {
    max-height: 70vh;
    overflow-y: scroll;
  }
</style>
