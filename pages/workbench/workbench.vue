<template>
  <view>
    <common></common>
    <uni-section title="营销管理" type="line"></uni-section>
    <u-grid :col="4" :border="true">
      <u-grid-item>
        <u-icon name="zhuanfa" :size="46"></u-icon>
        <view class="grid-text">社交推广</view>
      </u-grid-item>
    </u-grid>
    <uni-section title="销售管理" type="line"></uni-section>
    <u-grid :col="4" :border="true">
      <u-grid-item @click="handleItemClick($event, '/pages/lead/leadList/leadList')">
        <u-icon name="share-fill" :size="46"></u-icon>
        <view class="grid-text">{{this.featureLabels["lead"]}}</view>
      </u-grid-item>
      <u-grid-item @click="handleItemClick($event, '/pages/leadCommon/leadList/leadList')">
        <u-icon name="/static/icons/LC_icon_share_fill_1.png" :size="46"></u-icon>
        <view class="grid-text">{{this.featureLabels["lead_common"]}}</view>
      </u-grid-item>
      <u-grid-item @click="handleItemClick($event, '/pages/customer/customerList/customerList')">
        <u-icon name="account-fill" :size="46"></u-icon>
        <view class="grid-text">{{this.featureLabels["customer"]}}</view>
      </u-grid-item>
      <u-grid-item @click="handleItemClick($event, '/pages/customerCommon/customerList/customerList')">
        <u-icon name="/static/icons/account-multiple.png" :size="46"></u-icon>
        <view class="grid-text">{{this.featureLabels["customer_common"]}}</view>
      </u-grid-item>
      <u-grid-item @click="handleItemClick($event, '/pages/contact/contactList/contactList')">
        <u-icon name="/static/icons/contact.png" :size="46"></u-icon>
        <view class="grid-text">{{this.featureLabels["contact"]}}</view>
      </u-grid-item>
      <u-grid-item @click="handleItemClick($event, '/pages/opportunity/opportunityList/opportunityList')">
        <u-icon name="rmb" :size="46"></u-icon>
        <view class="grid-text">{{this.featureLabels["opportunity"]}}</view>
      </u-grid-item>
      <u-grid-item @click="handleItemClick($event, '/pages/contract/contractList/contractList')">
        <u-icon name="order" :size="46"></u-icon>
        <view class="grid-text">{{this.featureLabels["contract"]}}</view>
      </u-grid-item>
      <u-grid-item>
        <u-icon name="/static/icons/PaymentRcharge.png" :size="46"></u-icon>
        <view class="grid-text">{{this.featureLabels["received_payment"]}}</view>
      </u-grid-item>
      <u-grid-item @click="handleItemClick($event, '/pages/product/productList/productList')">
        <u-icon name="bag-fill" :size="46"></u-icon>
        <view class="grid-text">{{this.featureLabels["product"]}}</view>
      </u-grid-item>
    </u-grid>
    <uni-section title="销售支持" type="line"></uni-section>
    <u-grid :col="4" :border="true">
      <u-grid-item @click="handleItemClick($event, '/pages/revisitLog/revisitLogList/revisitLogList')">
        <u-icon name="/static/icons/revisitLog.png" :size="46"></u-icon>
        <view class="grid-text">{{this.featureLabels["revisit_log"]}}</view>
      </u-grid-item>
      <u-grid-item @click="handleItemClick($event, '/pages/scheduleReport/scheduleReportList/scheduleReportList')">
        <u-icon name="/static/icons/scheduleReport.png" :size="46"></u-icon>
        <view class="grid-text">{{this.featureLabels["schedule_report"]}}</view>
      </u-grid-item>
      <u-grid-item @click="handleItemClick($event, '/pages/wiki/knowledgeArticleList/knowledgeArticleList')">
        <u-icon name="zhihu" :size="46"></u-icon>
        <view class="grid-text">{{this.featureLabels["knowledge_article"]}}</view>
      </u-grid-item>
    </u-grid>
  </view>
</template>

<script>
  import {
    mapGetters,
    mapState,
    mapMutations
  } from 'vuex';
  export default {
    data() {
      return {
        featureLabels: getApp().globalData.featureLabels
      }
    },
    computed: {
    },
    async onLoad(option) {
      console.debug('加载工作台', option);

      // REVIEW onLaunch 和 onLoad 是并行执行的, 需要在首页使用 promise 保证初始化完成
      if (Object.keys(this.featureLabels) == 0) {
        await getApp().globalData.initGlobalData();
        _.delay(()=> {
          this.featureLabels = getApp().globalData.featureLabels;
        }, 10)
      }
    },
    mounted (){
    },
    methods: {
      handleItemClick (event, url) {
        uni.navigateTo({
          url
        });
      }
    }
  }
</script>

<style>
</style>
