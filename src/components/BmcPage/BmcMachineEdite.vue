<template>
  <el-dialog title="编辑机器信息" :visible.sync="dialogFormVisible">
    <el-form :model="MachineInfo">
      <el-form-item label="BMC IP" :label-width="formLabelWidth">
        <el-input v-model="MachineInfo.bmc_ip" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="用户名" :label-width="formLabelWidth">
        <el-input v-model="MachineInfo.username" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="密码" :label-width="formLabelWidth">
        <el-input v-model="MachineInfo.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="协议类型" :label-width="formLabelWidth">
        <el-radio
          v-model="MachineInfo.login_way_type"
          label="https"
          border
          size="medium"
          >https</el-radio
        >
        <el-radio
          v-model="MachineInfo.login_way_type"
          label="http"
          border
          size="medium"
          >http</el-radio
        >
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="saveChange">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "BmcMachineEdite",
  props: {
    MachineInfo: Object,
    dialogFormVisible: Boolean
  },
  data() {
    return {
      formLabelWidth: "120px"
    };
  },
  methods: {
    saveChange() {
      console.log("saveChange");
      let editMachineInfo = this.MachineInfo;
      this.$emit("save", editMachineInfo); //通知父组件改变。
    },
    closeDialog() {
      this.$emit("close");
    }
  }
};
</script>

<style lang="less"></style>
