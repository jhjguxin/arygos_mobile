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
      <u-grid-item @click="handleItemClick($event, '/pages/lead/leadList/leadList', 'lead#show')">
        <u-icon name="share-fill" :size="46"></u-icon>
        <view class="grid-text">{{this.featureLabels["lead"]}}</view>
      </u-grid-item>
      <u-grid-item @click="handleItemClick($event, '/pages/leadCommon/leadList/leadList', 'lead#show_lead_common')">
        <u-icon name="/static/icons/LC_icon_share_fill_1.png" :size="46"></u-icon>
        <view class="grid-text">{{this.featureLabels["lead_common"]}}</view>
      </u-grid-item>
      <u-grid-item @click="handleItemClick($event, '/pages/customer/customerList/customerList', 'customer#show')">
        <u-icon name="account-fill" :size="46"></u-icon>
        <view class="grid-text">{{this.featureLabels["customer"]}}</view>
      </u-grid-item>
      <u-grid-item @click="handleItemClick($event, '/pages/customerCommon/customerList/customerList', 'customer#show_customer_common')">
        <u-icon name="/static/icons/account-multiple.png" :size="46"></u-icon>
        <view class="grid-text">{{this.featureLabels["customer_common"]}}</view>
      </u-grid-item>
      <u-grid-item @click="handleItemClick($event, '/pages/contact/contactList/contactList', 'contact#show')">
        <u-icon name="/static/icons/contact.png" :size="46"></u-icon>
        <view class="grid-text">{{this.featureLabels["contact"]}}</view>
      </u-grid-item>
      <u-grid-item @click="handleItemClick($event, '/pages/opportunity/opportunityList/opportunityList', 'opportunity#show')">
        <u-icon name="rmb" :size="46"></u-icon>
        <view class="grid-text">{{this.featureLabels["opportunity"]}}</view>
      </u-grid-item>
      <u-grid-item @click="handleItemClick($event, '/pages/contract/contractList/contractList', 'contract#show')">
        <u-icon name="order" :size="46"></u-icon>
        <view class="grid-text">{{this.featureLabels["contract"]}}</view>
      </u-grid-item>
      <u-grid-item @click="handleItemClick($event, '/pages/receivedPaymentCenter/receivedPaymentCenter')">
        <u-icon name="/static/icons/paymentRcharge.png" :size="46"></u-icon>
        <view class="grid-text">回款</view>
      </u-grid-item>
      <u-grid-item @click="handleItemClick($event, '/pages/approval/approvalList/approvalList')" v-if="showApprovalList">
        <u-icon name="/static/icons/approval.png" :size="46"></u-icon>
        <view class="grid-text">审批</view>
      </u-grid-item>
      <u-grid-item @click="handleItemClick($event, '/pages/product/productList/productList', 'product#show')">
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
      <u-grid-item @click="handleItemClick($event, '/pages/wiki/knowledgeArticleList/knowledgeArticleList', 'knowledge_article#show')">
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
  import Policy from 'services/policy';
  import Feature from 'services/feature';
  import ApprovalSetting from 'services/approval_setting';

  export default {
    data() {
      return {
        featureLabels: {},
        showApprovalList: false
      }
    },
    onShow () {
      console.debug('显示工作台');

      let { getters: {getHasLogin: hasLogin } } = this.$store;

      // 检查用户登陆状态
      if (hasLogin) {
        this.featureLabels = getApp().globalData.featureLabels;

        // REVIEW onLaunch 和 onLoad 是并行执行的, 需要在首页使用 promise 保证初始化完成
        if (Object.keys(this.featureLabels) == 0) {
          getApp().globalData.initGlobalData().then(()=> {
            _.delay(()=> {
              this.featureLabels = getApp().globalData.featureLabels;
            }, 50)
          });
        }
      }
    },
    async mounted (){
      let policy = await Policy.instance();
      let approvalSetting = await ApprovalSetting.instance();
      let feature = await Feature.instance();

      let model_names = [
        'Contract', 'ReceivedPayment', 'Opportunity'
      ];
      model_names = _.filter(model_names, (name) => (feature.isEnable({ name: _.snakeCase(name) })));
      let showApprovalList = ! _.every(model_names, (name) => !approvalSetting.isEnable({ name: _.snakeCase(name) }));

      this.showApprovalList = showApprovalList;
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
    computed: {
    }
  }
</script>

<style>
</style>
