<template>
  <view>
    <view>
      <u-card
        full
        :title="approval_detail.approvable.name"
        :sub-title="approval_detail.applier.name"
        :margin="card.margin"
        :padding="card.padding"
        :show-foot="card.showFoot"
        v-if="detail && approval_detail"
      >
        <view slot="body">
          <u-row gutter="16"  v-if="customFieldsObject['approve_status']">
            <u-col span="3" class="u-font-xs">
              <view>{{customFieldsObject['approve_status'].label}}</view>
            </u-col>
            <u-col span="9">
              <custom-field-on-show :customField="customFieldsObject['approve_status']" :record="approval_detail" />
            </u-col>
          </u-row>
          <u-row gutter="16"  v-if="customFieldsObject['submit_applying_at']">
            <u-col span="3" class="u-font-xs">
              <view>{{customFieldsObject['submit_applying_at'].label}}</view>
            </u-col>
            <u-col span="9">
              <custom-field-on-show :customField="customFieldsObject['submit_applying_at']" :record="approval_detail" />
            </u-col>
          </u-row>
          <u-row gutter="16"  v-if="customFieldsObject['finish_approve_at']">
            <u-col span="3" class="u-font-xs">
              <view>{{customFieldsObject['finish_approve_at'].label}}</view>
            </u-col>
            <u-col span="9">
              <custom-field-on-show :customField="customFieldsObject['finish_approve_at']" :record="approval_detail" />
            </u-col>
          </u-row>
        </view>
      </u-card>
      <u-tabs-swiper
        ref="tabs" :list="tabs.list" :current="tabs.current" :is-scroll="false"
        @change="handleTabsSwiperChange"
      ></u-tabs-swiper>
      <view v-if="tabs.current == 0" class="u-padding-bottom-80">
        <approval-timeline
          :approvalDetail="approval_detail"
          style="height: 60vh;"
          v-if="approval_detail"
        />
        
        <u-grid :col="operations.length"  :border="true" class="fixed-bottom"  v-if="operations.length > 0">
          <u-grid-item @click="handleItemClick($event, item.name)"  v-for="(item, index) in operations" :key="item.name">
            <view class="grid-text">{{item.text}}</view>
          </u-grid-item>
        </u-grid>
      </view>
      <view v-if="tabs.current == 1">
        <sales-activity-list
          :params="salesActivityList.params"
          style="height: 65vh;"
          ref="salesActivityList"
          v-if="salesActivityList.params"
          />
      </view>

      <view v-if="tabs.current == 2">
        <entity-base-info
          :model="detail" :klassName="klassName"
          style="height: 65vh;"
        />
      </view>
      <view v-if="tabs.current == 3 && showAttachmentList">
        <attachment-list
          ref="attachmentList"
          :model="detail" :klassName="klassName"
          :params="attachmentList.params"
          style="height: 65vh;"
        />
        </u-grid>
      </view>
    </view>
    <unauthorized v-if="isInvalidData"/>
  </view>
</template>

<script>
  import _ from 'lodash';
  import { contractApi, opportunityApi, receivedPaymentApi, approvalApi } from 'services/http';
  import CustomField from 'services/custom_field';

  export default {
    data() {
      let featureLabels = getApp().globalData.featureLabels;

      return {
        id: 0,
        isInvalidData: false,
        detail: null,
        approval_detail: null,
        operations: [],
        customFieldsObject: null,
        card: {
          margin: "0 20rpx",
          padding: 30,
          showFoot: false
        },
        tabs: {
          list: [
            {
              name: "审批进度"
            },
            {
              name: '销售动态'
            },
            {
              name: '详情'
            }
          ],
          current: 0
        },
        showAttachmentList: false,
        salesActivityList: {},
        productAssetList: {},
        attachmentList: {},
        featureLabels: getApp().globalData.featureLabels,
      }
    },
    async onLoad(options) {
      let { approvable_id, approvable_type } = options;
      const klassName = approvable_type;

      if (!(approvable_id && approvable_type)) return null;

      this.klassName = approvable_type;
      this.approvable_id = approvable_id;
      this.approvable_type = approvable_type;

      let customFields = await CustomField.instance().fetchData(klassName);
      let detail = await this.fetchDetailData({ approvable_id, approvable_type });
      let approval_detail = await this.fetchApprovalDetail({ approvable_id, approvable_type });
      let operations = await this.fetchApprovalOperations({ approvable_id, approvable_type }) || [];

      this.customFields = customFields;
      this.customFieldsObject = Object.assign({}, ...customFields.map(customField => ({[customField.name]: customField})));
      this.detail= detail;
      this.approval_detail = approval_detail;
      this.operations = operations;

      this.salesActivityList = {
        params: {
          [`${_.snakeCase(klassName)}_id`]: approvable_id
        }
      };

      this.contactAssetshipList = {
         params: {
           approvable_id
         }
       };
      this.productAssetList = {
        params: {
          approvable_id
        }
      };

      if (_.includes(["Contract", "Opportunity"], klassName)) {
        let { tabs } = this;

        this.attachmentList = {
          params: {
            attachmentable_type: klassName,
            attachmentable_id: approvable_id
          }
        };
        tabs.list.push({
          name: "附件"
        });

        this.tabs = tabs;
        this.showAttachmentList = true;
      }

    },
    methods: {
      onBackPress() {
      },
      async fetchDetailData ({ approvable_id, approvable_type }) {
        uni.showLoading({
          title: '加载中'
        });
        
        let api = {
          Contract: contractApi,
          Opportunity: opportunityApi,
          ReceivedPayment: receivedPaymentApi
        }[approvable_type];
        
        if (_.isNil(api)) {
          uni.showToast({
            icon: 'none',
            title: "获取数据失败",
            duration: 1000
          });
          return null
         };

        let res = await api.show({id: approvable_id});
        let {
          data: {
            code, remark, data: model
          }
        } = res;

        _.delay(()=>{
          uni.hideLoading();
        }, 100);

        if (code == 0) {
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
      async fetchApprovalDetail({ approvable_id, approvable_type }) {
        let res = await approvalApi.approval_detail({ approvable_id, approvable_type });
        let {
          data: {
            code, remark, data: model
          }
        } = res;

        if (code == 0) {
          return model;
        } else {
          _.delay(()=>{
            uni.showToast({
              icon: 'none',
              title: remark || "获取数据失败",
              duration: 1000
            });
          }, 200);

          return null;
        }
      },
      async fetchApprovalOperations({ approvable_id, approvable_type }) {
        let res = await approvalApi.operations({ approvable_id, approvable_type });
        let {
          data: {
            code, remark, data: model
          }
        } = res;
        let operationText = {
          applying: "发起审批",
          approve: "审批通过",
          deny: "审批否决",
          revert: "撤销审批"
        };

        if (code == 0) {
          return _.map(model, (key)=> (
            {
              name: key,
              text: operationText[key]
            }
          ));
        } else {
          _.delay(()=>{
            uni.showToast({
              icon: 'none',
              title: remark || "获取数据失败",
              duration: 1000
            });
          }, 200);

          return null;
        }
      },
      handleTabsSwiperChange (value) {
        this.tabs.current = value;
      },
      handleItemClick (event, key) {
        let { approvable_id, approvable_type } = this;
        if (key == "applying") {
          uni.navigateTo({
            url: `/pages/approval/approvalApplying/approvalApplying?approvable_id=${approvable_id}&approvable_type=${approvable_type}`
          })
          return;
        }
        if (key == "approve") {
          uni.navigateTo({
            url: `/pages/approval/approvalApprove/approvalApprove?approvable_id=${approvable_id}&approvable_type=${approvable_type}`
          })
          return;
        }
        if (key == "deny") {
          uni.navigateTo({
            url: `/pages/approval/approvalDeny/approvalDeny?approvable_id=${approvable_id}&approvable_type=${approvable_type}`
          })
          return;
        }
        if (key == "revert") {
          uni.navigateTo({
            url: `/pages/approval/approvalRevert/approvalRevert?approvable_id=${approvable_id}&approvable_type=${approvable_type}`
          })
          return;
        }
      },
    }
  }
</script>

<style>
  .fixed-bottom {
      position: fixed;
      right: 0;
      bottom: calc( var(--window-bottom) + 0px);
      left: 0;
      z-index: 1030;
      margin-bottom: 6;
  }
</style>
