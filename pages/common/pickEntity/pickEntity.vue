<template>
  <view>
    <u-tabs-swiper
      ref="uTabs" :list="tabsSwiper.list" :is-scroll="tabsSwiper.isScroll"
      :current="tabsSwiper.current"
      @change="handleTabsSwiperChange"
    ></u-tabs-swiper>
    <swiper class="swiper" :current="tabsSwiper.current" @transition="transition" @animationfinish="animationfinish">
      <swiper-item v-for="(item, index) in swiperItems" :key="index">
        <pick-entity-item
          :klassName="item.klassName"
          :ref="item.ref"
          @select="handleSelect"
        ></pick-entity-item>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
  const qs = require('qs');

  export default {
    data() {
      const featureLabels = getApp().globalData.featureLabels;

      return {
        returnAction: "revisitLogNew",
        tabsSwiper: {
          list: [
            {
              name: featureLabels['lead']
            },
            {
              name: featureLabels['customer']
            },
            {
              name: featureLabels['opportunity']
            },
            {
              name: featureLabels['contract']
            }
          ],
          isScroll: false,
          current: 0
        },
        swiperItems: [
          {
            klassName: "Lead",
            ref: 'pick-entity-item-lead'
          },
          {
            klassName: "Customer",
            ref: 'pick-entity-item-customer'
          },
          {
            klassName: "Opportunity",
            ref: 'pick-entity-item-opportunity'
          },
          {
            klassName: "Contract",
            ref: 'pick-entity-item-contract'
          }
        ]
      }
    },
    onLoad(options) {
      let { current = 0, returnAction = "revisitLogNew" } = options;
      this.tabsSwiper = {
        ...this.tabsSwiper,
        current
      };
      this.returnAction = returnAction;

      _.delay(()=> {
        this.loadEntityItemData();
      },10);
    },
    methods: {
      handleTabsSwiperChange (index) {
        this.tabsSwiper.current = index;

        this.loadEntityItemData()
      },
      loadEntityItemData() {
        let {tabsSwiper: {current: index}, swiperItems} = this;
        let { ref: refName } = swiperItems[index];
        let { [`${refName}`]: pickEntityItemRef } = this.$refs;

        // 加载当前Tab数据
        pickEntityItemRef[0].fetchData({});
      },
      handleSelect (params) {
        let { returnAction } = this;
        let url;
        let { klassName, id } = params;

        switch (returnAction) {
          case "revisitLogNew":
            url = `/pages/revisitLog/revisitLogNew/revisitLogNew?loggable_type=${klassName}&loggable_id=${id}`
            break;
          case "eventNew":
            url = `/pages/event/eventNew/eventNew?related_item_type=${klassName}&related_item_id=${id}`
            break;
        }

        uni.redirectTo({
          url
        })
      },
      // swiper-item左右移动，通知tabs的滑块跟随移动
      transition(e) {
        let dx = e.detail.dx;
        this.$refs.uTabs.setDx(dx);
      },
      // 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
      // swiper滑动结束，分别设置tabs和swiper的状态
      animationfinish(e) {
        let current = e.detail.current;
        this.$refs.uTabs.setFinishCurrent(current);
        this.swiperCurrent = current;
        this.tabsSwiper.current = current;
      }
    }
  }
</script>

<style>
  .wrap {
    padding: 24rpx;
  }
  .swiper {
    height: calc(100vh - var(--window-bottom) - var(--window-top));
  }
</style>
