import Vue from "vue";
import axios from "axios";

import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "@/style/varaible.css";
import _ from "lodash";

Vue.prototype._ = _;

Vue.config.productionTip = false;
// axios.defaults.adapter = require('axios/lib/adapters/http');

// axios.defaults.adapter = require('axios/lib/adapters/http');


if (!process.env.IS_WEB) Vue.use(require("vue-electron"));
Vue.http = Vue.prototype.$http = axios;
// 为了以后获取上传或者下载进度
// [electron下使用axios网络请求错误的问题](http://www.okadwin.com/?post=16)
// axios.defaults.adapter = require('axios/lib/adapters/xhr');


Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
