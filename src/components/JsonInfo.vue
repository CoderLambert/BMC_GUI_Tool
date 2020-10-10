<template>
  <el-row v-show="jsonInfo != 'null'">
    <el-col :span="24" class="page-conf-box">
      <h3>配置信息</h3>
      <p>文件路径: {{ filePath }}</p>
      <pre class="page-conf">{{ jsonInfo }}</pre>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "JsonInfo",
  props: {
    jsonInfo: {
      type: String,
      required: true
    },
    filePath: {
      type: String,
      required: true
    }
  }
};
</script>
<style scoped>
.page-conf-box {
  padding: 0 40px;
}

.page-conf {
  padding: 20px;
  font-size: 14px;
  border-radius: 20px;
  background: #ededed;
}
</style>
