<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane label="配置管理">
        <BiosDevTab></BiosDevTab>
      </el-tab-pane>
      <el-tab-pane label="更新界面">
        <BiosUpdateTable></BiosUpdateTable>
      </el-tab-pane>
      <el-tab-pane label="日志记录">日志记录</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import BiosDevTab from "../components/BiosPage/BiosDevTab";
//   import BiosConfig from '../components/BiosPage/BiosConfig'
import BiosUpdateTable from "../components/BiosPage/BiosUpdate";


export default {
  name: "biospage",
  // components: { BiosConfig },
  data() {
    return {
      activeName: "conf"
    };
  },
  mounted() {},
  methods: {},
  components: {
    BiosDevTab,
    BiosUpdateTable
  }
};
</script>

<style lang="less">
  .el-tabs {
    min-height: calc(100vh - 89px);
    margin-top: 20px
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
