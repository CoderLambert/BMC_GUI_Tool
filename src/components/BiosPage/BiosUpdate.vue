<template>
  <div class="bios-dev-page">
    <section class="bios-update-box">
      <span>
        <strong>当前镜像路径：</strong>
        {{ biosImageFilePath }}
      </span>
    </section>

    <section class="page-bios-parese-box">
      <el-table :data="MachineList" stripe style="width: 100%">
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
            {{ imageUpdateStates[scope.row.imageUpdateStates] }}
            <!-- <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button> -->
            <!-- <el-button type="text" size="small">编辑</el-button> -->
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="310">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" size="small" type="success">编辑</el-button>

            <el-button
              @click="startBiosUpdateWithSingle(scope.row)"
              size="small"
              type="primary"
            >开始更新</el-button>
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
import { ImageUpdateStates } from "../../lib/varaible.js";
import { mapState, mapGetters } from "vuex";
import Qs from "qs";
const { net } = require("electron").remote;

export default {
  name: "BiosUpdateTable",
  data() {
    return {
      MachineList: [],
      imageUpdateStates: ImageUpdateStates
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

  beforeUpdate() {
    this.MachineList = this._.cloneDeep(this.biosConfListForUpdate);
  },
  methods: {
    showLoginWayType(value) {
      console.log(value);
    },

    // 开始更新一台机器
    // 1. 获取 coockie 信息
    startBiosUpdateWithSingle(biosConf) {
      // 构造表单登录信息

      // 开始发起登录请求

      let userInfo = Qs.stringify({
        username: biosConf.username,
        password: biosConf.password
      });

      const api_name = "/api/session";

      let postOptions = {
        method: "POST",
        protocol: `${biosConf.login_way_type}:`,
        hostname: `${biosConf.bmc_ip}`,
        port: biosConf.login_way_type.toLowerCase() == "https" ? 443 : 80,
        path: "/api/session",
        // timeout: 3000,

        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      };
      const request = net.request(postOptions);

      request.write(userInfo);

      let resResult = {
        CSRFToken: null,
        Coockie: null,
        statusCode: null,
        errMessage: null
      };

      request.on("response", response => {
        console.log(`STATUS: ${response.statusCode}`);
        console.log("登录响应结果：");

        resResult.statusCode = response.statusCode;
        if (this._.has(response.headers, "set-cookie")) {
          let sessionReg = /(QSESSIONID=[a-zA-Z0-9]+);/gi;
          let setCoockie = response.headers["set-cookie"][0];
          // console.log(setCoockie)
          let matchResult = setCoockie.match(sessionReg);
          if (matchResult.length > 0) {
            resResult.Coockie = matchResult[0] + "refresh_disable=1";
          }
        } else {
          // 登陆错误也会返回 状态吗 200，需要区分
          // 这儿是 BMC 后端返回状态码使用错误问题， 这儿修正
          resResult.errMessage = "密码用户名不正确";
          resResult.statusCode = 401;
          
        }
        // console.log(`Coockie ==> ${Coockie}`);

        // return response;
        response.on("data", chunk => {
          console.log(chunk);
          let chunkToString = chunk.toString();
          let jsonData = JSON.parse(chunkToString);
          console.log(`data: ${chunkToString}`);
          if (this._.has(jsonData, "CSRFToken")) {
            resResult.CSRFToken = jsonData["CSRFToken"];
            this.MachineList[biosConf.id].imageUpdateStates = "prepareFlashArea"
          }

             switch (resResult.statusCode) {
                case 200:
                  {
                    const csrfToken = resResult.CSRFToken;
                    console.log('csrfToken => ' + csrfToken )
                    // TODO 开始进行刷写 BIOS
                    console.log(' 开始进行刷写 BIOS');

                    this.$notify({
                      title: `${biosConf.bmc_ip} 进度通知`,
                      message: this.$createElement('i', { style: 'color: teal'}, `开始进行刷写`)
                    });
                    this.MachineList[biosConf.id].imageUpdateStates = "prepareFlashArea";

                  }
                  break;
                case 401: {              
                    this.$notify({
                      title: `${biosConf.bmc_ip} 错误通知`,
                      message: this.$createElement('i', { style: 'color: red'}, `无法获取机器Token,请确认机器信息`)
                    });
                    this.MachineList[biosConf.id].imageUpdateStates = "loginFailed";
                break;
               }
                default:{
                  this.$notify({
                        title: `${biosConf.bmc_ip} 错误通知`,
                        message: this.$createElement('i', { style: 'color: red'}, `未知错误`)
                      }); 
                    break;  
                };
              }


        });


        response.on("error", error => {
          console.log(`响应 ERROR: ${JSON.stringify(error)}`);
          this.$notify({
                title: `${biosConf.bmc_ip} 错误通知`,
                message: this.$createElement('i', { style: 'color: red'}, `响应 ERROR￥`)
              }); 

          return error;
        });


      });

      request.on("error", e => {
        console.log("登录请求发生错误 ==> " + e.message);
        console.log(e);

        resResult.errMessage = e.message;
        if (e.message.indexOf("ERR_CONNECTION_TIMED_OUT") > 0) {
          resResult.statusCode = 408;
          this.MachineList[biosConf.id].imageUpdateStates = "connectTimeOut";
          this.$notify({
            title: `${biosConf.bmc_ip} 超时通知`,
            message: this.$createElement('i', { style: 'color: teal'}, `机器长时间无响应，请检查机器状态和配置信息`)
          });

        } else {
          resResult.statusCode = 500;
          
          this.MachineList[biosConf.id].imageUpdateStates = "abort";

          this.$notify({
            title: `${biosConf.bmc_ip} 请求错误通知`,
            message: this.$createElement('i', { style: 'color: red'}, `获取机器Token发生错误`)
          });

        }
      });



      request.end();
    },

    // 注销退出接口
    logoutFromBMC() {},


    // GET 测试接口
    // getDashBoardEvent(axios) {
    //   getHost()
    //   axios.get()
    // },

    getHost(conf, apiName) {
      return `${conf.login_way_type}://${conf.bmc_ip}${apiName}`;
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
