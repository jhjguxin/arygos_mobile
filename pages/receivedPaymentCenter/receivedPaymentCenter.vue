<template>
  <view class="u-p-t-20 wrap">
    <u-grid :col="3">
      <u-grid-item @click="handleItemClick($event, '/pages/receivedPayment/receivedPaymentList/receivedPaymentList', 'received_payment#show')">
        <u-icon name="/static/icons/paymentRcharge.png" :size="46"></u-icon>
        <view class="grid-text">{{this.featureLabels["received_payment"]}}</view>
      </u-grid-item>
      <u-grid-item @click="handleItemClick($event, '/pages/receivedPaymentPlan/receivedPaymentPlanList/receivedPaymentPlanList', 'received_payment_plan#crud')">
        <u-icon name="/static/icons/receivedPaymentPlan.png" :size="46"></u-icon>
        <view class="grid-text">{{this.featureLabels["received_payment_plan"]}}</view>
      </u-grid-item>
      <u-grid-item @click="handleItemClick($event, '/pages/invoicedPayment/invoicedPaymentList/invoicedPaymentList', 'invoiced_payment#show')">
        <u-icon name="/static/icons/invoicedPayment.png" :size="46"></u-icon>
        <view class="grid-text">{{this.featureLabels["invoiced_payment"]}}</view>
      </u-grid-item>
    </u-grid>
  </view>
</template>

<script>
  import Policy from 'services/policy';
  export default {
    data() {
      return {
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
