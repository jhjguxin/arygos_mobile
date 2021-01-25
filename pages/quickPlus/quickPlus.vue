<template>
  <view class="content" :class="{'active':active}">
    <common></common>
    <image class="logo" :class="{'active': active}" src="/static/logo.png"  mode="aspectFit" />
    
    <view class="tabbar-box-wrap">
      <view class="tabbar-box">
        <u-row gutter="16">
          <u-grid :col="2"  :border="false">
            <u-grid-item index="customer">
              <u-button type="primary" @click="handleItemClick($event, '/pages/customer/customerNew/customerNew', 'customer#create')" >
                <u-icon name="account-fill" :size="40"></u-icon>新增{{this.featureLabels['customer']}}
              </u-button>
            </u-grid-item>
            <u-grid-item>
              <u-button type="primary"><u-icon name="scan" :size="40"></u-icon>名片扫描</u-button>
            </u-grid-item>
          </u-grid>
        </u-row>
        <u-gap height="2" bg-color="#bbb"></u-gap>
        <u-row>
          <u-grid :col="4"  :border="false">
            <u-grid-item index="revisit_log" @click="handleItemClick($event, '/pages/common/pickEntity/pickEntity?returnAction=revisitLogNew')">
              <u-icon name="/static/icons/revisitLog.png" :size="46"></u-icon>
              <view class="grid-text">写{{this.featureLabels['revisit_log']}}</view>
            </u-grid-item>
            <u-grid-item index="schedule_report" @click="handleItemClick($event, '/pages/scheduleReport/scheduleReportNew/scheduleReportNew')">
              <u-icon name="/static/icons/scheduleReport.png" :size="46"></u-icon>
              <view class="grid-text">{{this.featureLabels['schedule_report']}}</view>
            </u-grid-item>
            <u-grid-item index="event" @click="handleItemClick($event, '/pages/common/pickEntity/pickEntity?returnAction=eventNew')">
              <u-icon name="calendar" :size="46"></u-icon>
              <view class="grid-text">新增任务</view>
            </u-grid-item>
            <u-grid-item index="lead" @click="handleItemClick($event, '/pages/lead/leadNew/leadNew', 'lead#create')">
              <u-icon name="share-fill" :size="46"></u-icon>
              <view class="grid-text">新增{{this.featureLabels['lead']}}</view>
            </u-grid-item>
            <u-grid-item index="contact" @click="handleItemClick($event, '/pages/contact/contactNew/contactNew', 'contact#create')">
              <u-icon name="/static/icons/contact.png" :size="46"></u-icon>
              <view class="grid-text">新增{{this.featureLabels['contact']}}</view>
            </u-grid-item>
            <u-grid-item index="opportunity" @click="handleItemClick($event, '/pages/opportunity/opportunityNew/opportunityNew', 'opportunity#create')">
              <u-icon name="rmb" :size="46"></u-icon>
              <view class="grid-text">新增{{this.featureLabels['opportunity']}}</view>
            </u-grid-item>
            <u-grid-item index="contract" @click="handleItemClick($event, '/pages/contract/contractNew/contractNew', 'contract#create')">
              <u-icon name="order" :size="46"></u-icon>
              <view class="grid-text">新增{{this.featureLabels['contract']}}</view>
            </u-grid-item>
            <u-grid-item index="product" @click="handleItemClick($event, '/pages/product/productNew/productNew', 'product#create')">
              <u-icon name="bag" :size="46"></u-icon>
              <view class="grid-text">新增{{this.featureLabels['product']}}</view>
            </u-grid-item>
          </u-grid>
        </u-row>
      </view>
    </view>
  </view>
</template> 

<script>
import _ from 'lodash';
import Feature from 'services/feature';
import Policy from 'services/policy';

export default {
  data() {
    return {
      active: false,
      featureLabels: getApp().globalData.featureLabels
    };
  },
  onLoad() {
  },
  async mounted (){
    let policy = await Policy.instance();
    this.policy = policy;
  },
  onShow() {
    _.delay(() => {
      this.active = true;
    }, 300);
  },
  onHide() {
    this.active = false;
  },
  methods: {
    handleItemClick (event, url, authKey) {
      let { policy } = this;

      if ( policy.checkPermission({ authKey })) {
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
  }
};
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  /* #ifdef H5 */
  height: calc(100vh - var(--window-bottom) - var(--window-top));
  /* #endif */
  /* #ifndef H5 */
  height: 100vh;
  /* #endif */
  transition: opacity 0.3s;
  background: #999;
  opacity: 0;
  &.active {
    opacity: 1;
  }
  .logo {
    position: relative;
    margin-top: -400upx;
    width: 200upx;
    height: 200upx;
    // z-index: -1;
    opacity: 0;
    transition: opacity 0.3s;
    &.active {
      opacity: 1;
    }
  }
}
.tabbar-box-wrap {
  position: absolute;
  width: 100%;
  padding: 50upx;
  box-sizing: border-box;
  bottom: 0;
  left: 0;
  .tabbar-box {
    position: relative;
    display: block;
    width: 100%;
    background: #fff;
    border-radius: 20upx;
    padding: 15upx 20upx;
    box-sizing: border-box;
    // z-index: 2;
    box-shadow: 0px 2px 5px 2px rgba(0, 0, 0, 0.1);
    &:after {
      content: '';
      position: absolute;
      bottom: -16upx;
      left: 0;
      right: 0;
      margin: auto;
      width: 50upx;
      height: 50upx;
      transform: rotate(45deg);
      background: #fff;
      // z-index: 1;
      box-shadow: 2px 2px 5px 1px rgba(0, 0, 0, 0.1);
      border-radius: 2px;
    }
    // &:before {
    //   content: '';
    //   position: absolute;
    //   top: 0;
    //   left: 0;
    //   width: 100%;
    //   height: 100%;
    //   background: #ffffff;
    //   border-radius: 20upx;
    //   // z-index: 2;
    // }
  }
}
</style>
