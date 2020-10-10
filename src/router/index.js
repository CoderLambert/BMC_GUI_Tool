import Vue from "vue";
import Router from "vue-router";
import BmcConf from "../components/BmcPage/BmcConf";
import BMCUpdateTable from "../components/BmcPage/BmcUpdate";

import BiosDevTab from "../components/BiosPage/BiosDevTab";
import BiosUpdateTable from "../components/BiosPage/BiosUpdate";
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "bios",
      component: require("@/pages/BiosPageView").default,
      redirect: { name: "biosconf" },

      children: [
        // bios 配置
        {
          path: "biosconf",
          name: "biosconf",
          meta: {
            title: "bios 配置"
          },
          component: BiosDevTab
        },
        {
          path: "biosupdate",
          name: "biosupdate",
          meta: {
            title: "bios 更新"
          },
          component: BiosUpdateTable
        }
      ]
    },
    {
      path: "/bmc",
      name: "bmc",
      component: require("@/pages/BmcPageView").default,
      redirect: { name: "BmcConf" },

      children: [
        // BMC 配置
        {
          path: "BmcConf",
          name: "BmcConf",
          meta: {
            title: "BMC 配置"
          },
          component: BmcConf
        },
        {
          path: 'BmcUpdate',
          name: 'BmcUpdate',
          meta: {
            title: 'BMC 更新'
          },
          component: BMCUpdateTable
        }
      ]
    },

    {
      path: "/website",
      name: "website",
      component: require("@/pages/WebSite").default
    },

    {
      path: "*",
      redirect: "/"
    }
  ]
});
