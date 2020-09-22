<template>
  <div>
    <header>
      <NavBar></NavBar>
    </header>

    <main>
      <div id="app">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </div>
    </main>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar";

export default {
  name: "bmc_tool",
  components: {
    NavBar
  }
};
</script>

<style lang="less">
// @import './style/style.less';
</style>
