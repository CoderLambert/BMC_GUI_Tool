<template>
  <div>
    <NavTable :navTable="navTables"></NavTable>

    <!-- <keep-alive> -->
    <router-view />
    <!-- </keep-alive> -->
  </div>
</template>

<script>
import NavTable from "../components/NavTable";
export default {
  name: "biospage",
  data() {
    return {
      activeName: "conf",
      navTables: [
        { target: { name: "biosconf" }, title: "设置" },
        { target: { name: "biosupdate" }, title: "更新界面" }
      ]
    };
  },
  mounted() {},
  methods: {},
  components: {
    NavTable
  }
};
</script>

<style lang="less" scoped>
nav {
  margin-top: 5px;
  border-bottom: none;
  border-radius: 4px 4px 0 0;
  box-sizing: border-box;
}
a {
  padding: 0 20px;
  height: 40px;
  box-sizing: border-box;
  line-height: 40px;
  display: inline-block;
  list-style: none;
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  position: relative;
  text-decoration: none;
  border: 1px solid #eee;
}
.router-link-active {
  color: skyblue;
  // background: rgb(52, 236, 138);
}

.el-tabs {
  min-height: calc(100vh - 89px);
  margin-top: 20px;
}
.el-tabs__header {
  background: #e0f4d3;
}
.el-tabs__item {
  padding: 0 20px;
  height: 40px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  line-height: 40px;
  display: inline-block;
  list-style: none;
  font-size: 15px;
  font-weight: 500;
  color: #4c4c4d;
  position: relative;
  // background: white;
  &.is-active {
    color: white;
    background: #ffcf56;
  }
}
</style>
