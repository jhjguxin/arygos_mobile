import Vue from 'vue';
import App from './App';
import uView from 'uview-ui';
import store from './store';

import common from './components/common/common';

Vue.config.productionTip = false
Vue.prototype.$store = store;
Vue.use(uView);

Vue.component('common', common);

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
