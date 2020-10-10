<template>
  <div>
    <nav>
      <router-link
        v-for="(itme, index) in navTable"
        :key="index"
        :to="itme.target"
      >
        {{ itme.title }}
      </router-link>
    </nav>
  </div>
</template>

<script>
export default {
  name: "NavTable",
  props: {
    navTable: {
      type: Array,
      // 对象或数组默认值必须从一个工厂函数获取
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {}
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
</style>
