<template>
  <div class="bios-dev-page">
    <section class="bios-update-box">
      <span>
        <strong>当前镜像路径：</strong>
        {{biosImageFilePath}}
      </span>
    </section>

    <section class="page-bios-parese-box">
      <el-table :data="biosConfListForUpdate" stripe style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>

        <el-table-column prop="bmc_ip" label="BMC IP" width="180" sortable></el-table-column>

        <el-table-column prop="username" label="用户名" width="120" sortable></el-table-column>
        <el-table-column prop="password" label="密码" width="120" sortable></el-table-column>

        <el-table-column prop="login_way_type" label="协议类型" width="150" sortable>
          <template slot-scope="scope">
            <el-tag v-show="scope.row.login_way_type" type="success">HTTPS</el-tag>
            <el-tag v-show="!scope.row.login_way_type">HTTP</el-tag>

            <!-- <el-switch
              v-model="scope.row.login_way_type"
              @change="showLoginWayType"
              active-text="Https"
              inactive-text="Http"
            ></el-switch>-->
            <!-- <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button> -->
            <!-- <el-button type="text" size="small">编辑</el-button> -->
          </template>
        </el-table-column>
        <el-table-column prop="save_bios_config" label="保存BIOS设置" width="150" sortable>
          <template slot-scope="scope">
            <el-tag v-show="!scope.row.save_bios_config" type="success">Yes</el-tag>
            <el-tag v-show="scope.row.save_bios_config" type="info">No</el-tag>

            <!-- <el-switch v-model="scope.row.save_bios_config" active-text="Yes" inactive-text="No"></el-switch> -->
          </template>
        </el-table-column>

        <el-table-column fixed="right" label="当前状态" width="280">
          <template slot-scope="scope">
            {{imageUpdateStates[scope.row.imageUpdateStates]}}
            <!-- <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button> -->
            <!-- <el-button type="text" size="small">编辑</el-button> -->
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="310">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" size="small" type="success">编辑</el-button>

            <el-button @click="singleBiosUpdate(scope.row)" size="small" type="primary">开始更新</el-button>
            <el-button size="small" type="danger">停止更新</el-button>
          </template>
        </el-table-column>
      </el-table>
    </section>

    <section class="page-bios-opearation-box">
      <el-button @click="handleClick(scope.row)" size="small">更新全部</el-button>
      <el-button size="small" type="danger">停止</el-button>
    </section>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import Qs from "qs";
// import { remote } from "electron";
// const { net } = require("electron").remote;
// console.log(net);
export default {
  name: "BiosUpdateTable",
  data() {
    return {
      imageUpdateStates: {
        connect: "等待检测连接",
        login: "等待登录",
        logout: "退出",
        prepareFlashArea: "更新准备",
        uploadBIOSRom: "上传镜像",
        verifyBIOSRom: "验证镜像",
        flashBIOSRom: "开始刷新",
        getFlashProgress: "获取刷新进度",
        stop: "结束",
        abort: "异常结束更新"
      }
    };
  },

  computed: {
    ...mapState("BIOS", {
      biosList: state => state.biosConfList,
      biosImageFilePath: state => state.biosImageFilePath
    }),

    ...mapGetters("BIOS", {
      biosConfListText: "biosConfListText",
      biosConfListForUpdate: "biosConfListForUpdate"
    })
  },

  mounted() {},
  methods: {
    showLoginWayType(value) {
      console.log(value);
    },

    singleBiosUpdate(biosConf) {
      this.biosApi_login(biosConf);
    },
    getHost(conf, apiName) {
      return `${conf.login_way_type}://${conf.bmc_ip}${apiName}`;
    },
    biosApi_login(conf) {
      const api_name = "/api/session";
      let loginUrl = this.getHost(conf, api_name);
      console.log(`api path ==> ${loginUrl}`);

      let userinfo = Qs.stringify({
        username: conf.username,
        password: conf.password
      });

      this.$http
        .post(loginUrl, userinfo)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="less" scoped>
.bios-update-box {
  margin-top: 20px;
  margin-right: 50px;
  text-align: right;
  color: #bebebe;
}
.page-bios-opearation-box {
  margin-top: 20px;
  text-align: center;
}
</style>
