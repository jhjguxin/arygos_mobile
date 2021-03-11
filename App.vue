<script>
import _ from "lodash";
import {config} from './config';
import Feature from './services/feature';
import RedDot from './services/red_dot';

export default {
  onLaunch: function() {
    console.log('App Launch，app启动');

    let { getters: {getHasLogin: hasLogin } } = this.$store;

    // 检查用户登陆状态
    if (hasLogin) {
      // REVIEW onLaunch 和 onLoad 是并行执行的
      getApp().globalData.initGlobalData();

      _.delay(()=> {
        uni.switchTab({
          url: "/pages/workbench/workbench"
        });
      }, 50);

      RedDot.instance().todoDot().then((value)=> {
        if (value) {
          uni.setTabBarBadge({
            index: 1,
            text: value
          });
        }
      })
    } else {
      uni.navigateTo({
        url: "/pages/auth/login/login",
        success() {
          uni.showToast({
            icon: 'none',
            title: '您的登录已经过期，请重新登录！',
            duration: 2000
          });
        }
      });
    }
  },
  onShow: function(page) {
    console.log('App Show，app展现在前台', page);
  },
  onHide: function() {
    console.log('App Hide，app不再展现在前台');
  },
  globalData: {
    config,
    initGlobalData: async () => {
      const feature = await Feature.instance()
      getApp().globalData.feature = feature;
      getApp().globalData.featureLabels = feature?.labels;
    },
    feature: null,
    featureLabels: {}
  }
};
</script>

<style lang="scss">
  /*每个页面公共css */
  @import "uview-ui/index.scss";
</style>
