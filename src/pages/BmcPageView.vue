<template>
  <div>
    <NavTable :navTable="navTables"></NavTable>
    <router-view />
  </div>
</template>

<script>
import NavTable from "../components/NavTable";
export default {
  name: "bmc-page",
  components: { NavTable },
  data: function() {
    return {
      navTables: [
        { target: { name: "BmcConf" }, title: "设置" },
        { target: { name: "BmcUpdate" }, title: "更新界面" }
      ]
    };
  },
  methods: {}
};
</script>

<style></style>
