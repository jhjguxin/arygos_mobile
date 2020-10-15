<script>
import {config} from './config';
import Feature from './services/feature';

export default {
  onLaunch: function() {
    console.log('App Launch，app启动');
    
    Feature.instance().then((feature) => {
      getApp().globalData.feature = feature;
      console.log(JSON.stringify(feature.labels))
      getApp().globalData.featureLabels = feature.labels;
    });
    
    let { getters: {getHasLogin: hasLogin } } = this.$store;
    
    // 检查用户登陆状态
    if (hasLogin) {
      uni.navigateTo({
        url: "/pages/workbench/workbench"
      });
      setTimeout(() => {
        uni.setTabBarBadge({
          index: 1,
          text: '31'
        });
        // uni.showTabBarRedDot({
        //   index: 3
        // });
      }, 1000);

    } else {
      uni.navigateTo({
        url: "/pages/auth/login/login"
      })
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
    feature: null,
    featureLabels: {}
  }
};
</script>

<style lang="scss">
  /*每个页面公共css */ 
  @import "uview-ui/index.scss";
</style>
