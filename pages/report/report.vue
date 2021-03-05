<template>
  <view class="u-p-t-20 wrap">
    <uni-section :title="uniSection.entity_add" type="line"></uni-section>
    <u-grid :col="3">
      <u-grid-item @click="handleItemClick($event, '/pages/report/entityAddCreatedAt/entityAddCreatedAt', 'report_center#show')">
        <u-icon name="/static/img/tabbar/salesReport.png" :size="46"></u-icon>
        <view class="grid-text">创建时间汇总</view>
      </u-grid-item>
      <u-grid-item @click="handleItemClick($event, '/pages/report/entityAddUser/entityAddUser', 'report_center#show')">
        <u-icon name="/static/img/tabbar/salesReport.png" :size="46"></u-icon>
        <view class="grid-text">负责人汇总</view>
      </u-grid-item>
      <u-grid-item @click="handleItemClick($event, '/pages/report/entityAddCreator/entityAddCreator', 'report_center#show')">
        <u-icon name="/static/img/tabbar/salesReport.png" :size="46"></u-icon>
        <view class="grid-text">创建人汇总</view>
      </u-grid-item>
    </u-grid>

    <uni-section :title="uniSection.revisit_log" type="line"></uni-section>
    <u-grid :col="3">
      <u-grid-item @click="handleItemClick($event, '/pages/report/revisitLogLoggable/revisitLogLoggable', 'report_center#show')">
        <u-icon name="/static/img/tabbar/salesReport.png" :size="46"></u-icon>
        <view class="grid-text">跟进对象汇总</view>
      </u-grid-item>
      <u-grid-item @click="handleItemClick($event, '/pages/report/revisitLogCategory/revisitLogCategory', 'report_center#show')">
        <u-icon name="/static/img/tabbar/salesReport.png" :size="46"></u-icon>
        <view class="grid-text">跟进类型汇总</view>
      </u-grid-item>
    </u-grid>
    
    <uni-section :title="uniSection.customer" type="line"></uni-section>
    <u-grid :col="3">
      <u-grid-item @click="handleItemClick($event, '/pages/report/customerCountUser/customerCountUser', 'report_center#show')">
        <u-icon name="/static/img/tabbar/salesReport.png" :size="46"></u-icon>
        <view class="grid-text">按用户排名</view>
      </u-grid-item>
      <u-grid-item @click="handleItemClick($event, '/pages/report/customerCountDepartment/customerCountDepartment', 'report_center#show')">
        <u-icon name="/static/img/tabbar/salesReport.png" :size="46"></u-icon>
        <view class="grid-text">按部门排名</view>
      </u-grid-item>
    </u-grid>

    <uni-section :title="uniSection.opportunity" type="line"></uni-section>
    <u-grid :col="3">
      <u-grid-item @click="handleItemClick($event, '/pages/report/salesFunnel/salesFunnel', 'report_center#show')">
        <u-icon name="/static/img/tabbar/salesReport.png" :size="46"></u-icon>
        <view class="grid-text">销售漏斗</view>
      </u-grid-item>
      <u-grid-item @click="handleItemClick($event, '/pages/report/wonOpportunity/wonOpportunity', 'report_center#show')">
        <u-icon name="/static/img/tabbar/salesReport.png" :size="46"></u-icon>
        <view class="grid-text">赢单汇总</view>
      </u-grid-item>

      <u-grid-item @click="handleItemClick($event, '/pages/report/opportunityAmountUser/opportunityAmountUser', 'report_center#show')">
        <u-icon name="/static/img/tabbar/salesReport.png" :size="46"></u-icon>
        <view class="grid-text">按用户排名</view>
      </u-grid-item>
      <u-grid-item @click="handleItemClick($event, '/pages/report/opportunityAmountDepartment/opportunityAmountDepartment', 'report_center#show')">
        <u-icon name="/static/img/tabbar/salesReport.png" :size="46"></u-icon>
        <view class="grid-text">按部门排名</view>
      </u-grid-item>
    </u-grid>
    
    <uni-section :title="uniSection.contract" type="line"></uni-section>
    <u-grid :col="3">
      <u-grid-item @click="handleItemClick($event, '/pages/report/contract/contract', 'report_center#show')">
        <u-icon name="/static/img/tabbar/salesReport.png" :size="46"></u-icon>
        <view class="grid-text">{{featureLabels['contract']}}汇总</view>
      </u-grid-item>
      <u-grid-item @click="handleItemClick($event, '/pages/report/contractAmountUser/contractAmountUser', 'report_center#show')">
        <u-icon name="/static/img/tabbar/salesReport.png" :size="46"></u-icon>
        <view class="grid-text">按用户排名</view>
      </u-grid-item>
      <u-grid-item @click="handleItemClick($event, '/pages/report/contractAmountDepartment/contractAmountDepartment', 'report_center#show')">
        <u-icon name="/static/img/tabbar/salesReport.png" :size="46"></u-icon>
        <view class="grid-text">按部门排名</view>
      </u-grid-item>
    </u-grid>
    
    <uni-section :title="uniSection.received_payment" type="line"></uni-section>
    <u-grid :col="3">
      <u-grid-item @click="handleItemClick($event, '/pages/report/receivedPaymentAmountUser/receivedPaymentAmountUser', 'report_center#show')">
        <u-icon name="/static/img/tabbar/salesReport.png" :size="46"></u-icon>
        <view class="grid-text">按用户排名</view>
      </u-grid-item>
      <u-grid-item @click="handleItemClick($event, '/pages/report/receivedPaymentAmountDepartment/receivedPaymentAmountDepartment', 'report_center#show')">
        <u-icon name="/static/img/tabbar/salesReport.png" :size="46"></u-icon>
        <view class="grid-text">按部门排名</view>
      </u-grid-item>
    </u-grid>
    
    <uni-section :title="uniSection.received_payment_plan" type="line"></uni-section>
    <u-grid :col="3">
      <u-grid-item @click="handleItemClick($event, '/pages/report/ReceivedPaymentPlan/ReceivedPaymentPlan', 'report_center#show')">
        <u-icon name="/static/img/tabbar/salesReport.png" :size="46"></u-icon>
        <view class="grid-text">{{featureLabels['received_payment_plan']}}汇总</view>
      </u-grid-item>
    </u-grid>
    
    <uni-section :title="uniSection.product" type="line"></uni-section>
    <u-grid :col="3">
      <u-grid-item @click="handleItemClick($event, '/pages/report/productSalesProduct/productSalesProduct', 'report_center#show')">
        <u-icon name="/static/img/tabbar/salesReport.png" :size="46"></u-icon>
        <view class="grid-text">按{{featureLabels['product']}}汇总</view>
      </u-grid-item>
      <u-grid-item @click="handleItemClick($event, '/pages/report/productSalesProductCategory/productSalesProductCategory', 'report_center#show')">
        <u-icon name="/static/img/tabbar/salesReport.png" :size="46"></u-icon>
        <view class="grid-text">按{{featureLabels['product_category']}}汇总</view>
      </u-grid-item>
      <u-grid-item @click="handleItemClick($event, '/pages/report/productSalesYear/productSalesYear', 'report_center#show')">
        <u-icon name="/static/img/tabbar/salesReport.png" :size="46"></u-icon>
        <view class="grid-text">按年汇总</view>
      </u-grid-item>
    </u-grid>
  </view>
</template>

<script>
  import Policy from 'services/policy';
  export default {
    data() {
      let featureLabels = getApp().globalData.featureLabels;
      return {
        uniSection: {
          entity_add: "业务新增",
          revisit_log: `${featureLabels['revisit_log']}报表`,
          customer: `${featureLabels['customer']}报表`,
          opportunity: `${featureLabels['opportunity']}报表`,
          contract: `${featureLabels['contract']}报表`,
          received_payment: `${featureLabels['received_payment']}报表`,
          received_payment_plan: `${featureLabels['received_payment_plan']}报表`,
          product: `${featureLabels['product']}报表`,
        },
        featureLabels: getApp().globalData.featureLabels
      }
    },
    async mounted (){
      let policy = await Policy.instance();
      this.policy = policy;
    },
    methods: {
      handleItemClick (event, url, authKey) {
        let { policy } = this;

        if (policy.checkPermission({ authKey })) {
          uni.navigateTo({
            url
          });
        } else {
          uni.showToast({
            icon: 'none',
            title: "操作失败: 未授权操作",
            duration: 1000
          })
        }
      }
    },
  }
</script>

<style>
</style>
