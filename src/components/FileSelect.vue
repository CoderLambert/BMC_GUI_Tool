<template>
  <label class="file-select">
    <div class="select-button">
      <span v-if="value">当前文件：{{ value.name }}</span>
      <span v-else>选择镜像文件</span>
    </div>
    <input type="file" @change="handleFileChange" />
  </label>
</template>

<script>
export default {
  props: {
    value: File
  },

  methods: {
    handleFileChange(e) {
      this.$emit("input", e.target.files[0]);
    }
  }
};
</script>
<style lang="less">
.file-select > .select-button {
  padding: 0.8rem;
  color: white;
  background-color: #2ea169;
  border-radius: 0.3rem;
  width: 40%;
  min-width: 400px;
  margin: 20px auto;
  text-align: center;
  font-weight: bold;
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
}

.file-select > input[type="file"] {
  display: none;
}
</style>
