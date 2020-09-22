import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "bios",
      component: require("@/pages/BiosPageView").default
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
