<template>
  <ul class="website-box">
    <li
      class="website-box-itme"
      v-for="(webSite, index) in webSites"
      :key="index"
      @click="openSite(webSite.url)"
    >
      {{ webSite.name }}
    </li>
  </ul>
</template>

<script>
import { shell } from "electron";

export default {
  name: "DevdocSite",
  data() {
    return {
      webSites: [
        { name: "百度", url: "https://baidu.com" },
        { name: "测试机器", url: "https://10.8.20.121" },
        { name: "25years", url: "https://25years.xyz" },

        {
          name: "Vue 文档",
          url:
            "https://cn.vuejs.org/v2/guide/#%E5%A3%B0%E6%98%8E%E5%BC%8F%E6%B8%B2%E6%9F%93"
        },
        { name: "nodejs 文档", url: "http://nodejs.cn/api/" },
        { name: "Electron 文档", url: "https://www.electronjs.org/docs/api" },
        {
          name: "Element UI",
          url: "https://element.eleme.cn/#/zh-CN/component/layout"
        },
        { name: "技术胖", url: "https://www.jspang.com/detailed?id=62#toc21" },
        { name: "配色网站", url: "https://flatuicolors.com/palette/us" }
      ]
    };
  },
  mounted() {},
  methods: {
    openSite(url) {
      shell.openExternal(url);
      // window.open(url);
    }
  }
};
</script>

<style lang="less" scoped>
.website-box {
  display: flex;
  height: 50px;
  line-height: 50px;
  place-content: center;
  place-items: center;

  // margin: 10px 20px;
  .website-box-itme {
    list-style: none;
    line-height: 50px;
    height: 50px;
    padding: 0 20px;
    background: skyblue;
    text-align: center;
    font-size: 20px;
    // flex: 1;
    &:hover {
      cursor: pointer;
      background: cornsilk;
    }
  }
}
</style>
