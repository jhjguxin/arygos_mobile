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
      <u-grid-item>
        <u-icon name="share-fill" :size="46"></u-icon>
        <view class="grid-text">{{this.featureLabels["lead"]}}</view>
      </u-grid-item>
      <u-grid-item>
        <u-icon name="/static/icons/LC_icon_share_fill_1.png" :size="46"></u-icon>
        <view class="grid-text">{{this.featureLabels["lead_common"]}}</view>
      </u-grid-item>
      <u-grid-item>
        <u-icon name="account-fill" :size="46"></u-icon>
        <view class="grid-text">{{this.featureLabels["customer"]}}</view>
      </u-grid-item>
      <u-grid-item>
        <u-icon name="/static/icons/account-multiple.png" :size="46"></u-icon>
        <view class="grid-text">{{this.featureLabels["customer_common"]}}</view>
      </u-grid-item>
      <u-grid-item>
        <u-icon name="/static/icons/contact.png" :size="46"></u-icon>
        <view class="grid-text">{{this.featureLabels["contact"]}}</view>
      </u-grid-item>
      <u-grid-item>
        <u-icon name="rmb" :size="46"></u-icon>
        <view class="grid-text">{{this.featureLabels["opportunity"]}}</view>
      </u-grid-item>
      <u-grid-item>
        <u-icon name="order" :size="46"></u-icon>
        <view class="grid-text">{{this.featureLabels["contract"]}}</view>
      </u-grid-item>
      <u-grid-item>
        <u-icon name="/static/icons/PaymentRcharge.png" :size="46"></u-icon>
        <view class="grid-text">{{this.featureLabels["received_payment"]}}</view>
      </u-grid-item>
      <u-grid-item>
        <u-icon name="bag-fill" :size="46"></u-icon>
        <view class="grid-text">{{this.featureLabels["product"]}}</view>
      </u-grid-item>
    </u-grid>
    <uni-section title="销售支持" type="line"></uni-section>
    <u-grid :col="4" :border="true">
      <u-grid-item>
        <u-icon name="/static/icons/revisitLog.png" :size="46"></u-icon>
        <view class="grid-text">跟进记录</view>
      </u-grid-item>
      <u-grid-item>
        <u-icon name="/static/icons/scheduleReport.png" :size="46"></u-icon>
        <view class="grid-text">工作报告</view>
      </u-grid-item>
      <u-grid-item>
        <u-icon name="zhihu" :size="46"></u-icon>
        <view class="grid-text">知识库</view>
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
    onLoad: (option) => {
      console.debug('加载工作台', option)
    },
    mounted (){
    },
    methods: {
    }
  }
</script>

<style>

</style>
