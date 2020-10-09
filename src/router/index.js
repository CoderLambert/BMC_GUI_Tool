import Vue from "vue";
import Router from "vue-router";
import BiosDevTab from "../components/BiosPage/BiosDevTab";
//   import BiosConfig from '../components/BiosPage/BiosConfig'
import BiosUpdateTable from "../components/BiosPage/BiosUpdate";
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "bios",
      component: require("@/pages/BiosPageView").default,
      redirect: { name: 'biosconf' },

      children: [
        // bios 配置
        {
          path: 'biosconf',
          name: 'biosconf',
          meta: {
            title: 'bios 配置'
          },
          component: BiosDevTab
        },
        {
          path: 'biosupdate',
          name: 'biosupdate',
          meta: {
            title: 'bios 更新'
          },
          component: BiosUpdateTable
        }

      ]


    },
    {
      path: "/bmc",
      name: "bmc",
      component: require("@/pages/BmcPageView").default
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
