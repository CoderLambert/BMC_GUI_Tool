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
// axios 默认超时时间
axios.defaults.timeout = 12000;
// axios.defaults.withCredentials = true  // 让ajax携带cookie
// 添加请求拦截器
axios.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么
    console.log("[debug axios:]  config ==>");
    console.log(config);
    return config;
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axios.interceptors.response.use(
  function(response) {
    // 对响应数据做点什么
    console.log("--------------axios 正确响应拦截----------");
    return response;
  },
  function(error) {
    // 对响应错误做点什么
    console.log("--------------axios 错误拦截----------")
    console.log(error)
    // console.log("message ==> "  + error)
    // if(error.message.includes('timeout')){   // 判断请求异常信息中是否含有超时timeout字符串
    //   console.log(error);
    //   console.log("网络超时");
    //   ElementUI.Message.error({message: '请求超时!'});

    //   return "timeout";          // reject这个错误信息
    // }

    // if (error.response) {
    //   alert("--------------axios 错误拦截  response ----------")

    //   // The request was made and the server responded with a status code
    //   // that falls out of the range of 2xx
    //   console.log(error.response.data);
    //   console.log(error.response.status);
    //   console.log(error.response.headers);
    //   return error.response
    // } else if (error.request) {
    //   alert("--------------axios 错误拦截  request ----------")
    //   console.log(error);

    //   console.log(error.request);
    //   return error.request
    // } else {
    //   alert("--------------axios 错误拦截  message ----------")
    //   // Something happened in setting up the request that triggered an Error
    //   console.log('Error', error);
    //   return error.message
    // }
    // console.log(error.config);
    return error;
  }
);

// 为了以后获取上传或者下载进度
// [electron下使用axios网络请求错误的问题](http://www.okadwin.com/?post=16)
// axios.defaults.adapter = require('axios/lib/adapters/xhr');

Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
