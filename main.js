import Vue from 'vue';
import App from './App';
import uView from 'uview-ui';
import store from './store';

import dayjs from 'dayjs';
require('dayjs/locale/zh-cn');

Vue.config.productionTip = false
Vue.prototype.$store = store;
Vue.use(uView);

App.mpType = 'app';

dayjs.locale('zh-cn');

const app = new Vue({
  ...App
})
app.$mount()
