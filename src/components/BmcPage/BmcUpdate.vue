<template>
  <div class="bmc-dev-page">
    <section class="bmc-update-box">
      <file-select v-model="file"> </file-select>
    </section>
    <section class="page-bmc-parese-box">
      <el-table
        :data="bmcFlashList"
        @selection-change="handleSelectionChange"
        stripe
        style="width: 100%"
        ref="MachineTable"
      >
        <el-table-column type="selection" width="55"> </el-table-column>

        <el-table-column
          prop="bmc_ip"
          label="BMC IP"
          width="180"
          sortable
        ></el-table-column>

        <el-table-column
          prop="username"
          label="用户名"
          width="120"
          sortable
        ></el-table-column>
        <el-table-column
          prop="password"
          label="密码"
          width="120"
          sortable
        ></el-table-column>

        <el-table-column
          prop="login_way_type"
          label="协议类型"
          width="150"
          sortable
        >
          <template slot-scope="scope">
            <el-tag v-show="scope.row.login_way_type === 'https'" type="success"
              >HTTPS</el-tag
            >
            <el-tag v-show="scope.row.login_way_type === 'http'">HTTP</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="当前状态" width="280">
          <template slot-scope="scope">
            <span v-show="imageUpdateStates[scope.row.imageUpdateStates]">
              {{ imageUpdateStates[scope.row.imageUpdateStates] }}
            </span>
            <span v-show="!imageUpdateStates[scope.row.imageUpdateStates]">
              {{ scope.row.imageUpdateStates }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              @click="editBmcConf(scope.row)"
              size="small"
              type="primary"
              >编辑</el-button
            >

            <el-button
              @click="deletBmcConf(scope.row)"
              size="small"
              type="danger"
            >
              删除
            </el-button>

            <el-button
              @click="startBmcUpdateWithSingle(scope.row)"
              size="small"
              type="success"
              :disabled="startReady(scope.row)"
              >开始更新</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </section>

    <section class="page-bmc-opearation-box">
      <el-button size="small" type="primary" @click="saveBmcConf"
        >保存当前配置</el-button
      >

      <el-button
        type="success"
        @click="bmcFlashAll"
        size="small"
        :disabled="file === null"
        >批量更新</el-button
      >
    </section>

    <BmcMachineEdite
      :MachineInfo="editMachineInfo"
      :dialogFormVisible="FormVisible"
      @save="saveEditeInfo"
      @close="hideEditeInfo"
    ></BmcMachineEdite>
  </div>
</template>

<script>
import FileSelect from "components/FileSelect";
import { saveConfFile } from "../../lib/common.js";

import { ImageUpdateStates } from "../../lib/varaible.js";
import { mapState, mapGetters } from "vuex";
import BmcMachineEdite from "components/BmcPage/BmcMachineEdite";
import Qs from "qs";
const { net } = require("electron").remote;

export default {
  name: "BmcUpdateTable",
  data() {
    return {
      file: null,
      // bmcFlashList: [],
      imageUpdateStates: ImageUpdateStates,
      selectionData: [],
      FormVisible: false,
      editMachineInfo: {}
    };
  },
  components: {
    FileSelect,
    BmcMachineEdite
  },
  computed: {
    ...mapState("BMC", {
      bmcList: state => state.bmcConfList,
      bmcFlashList: state => state.bmcFlashList,
      bmcImageFilePath: state => state.bmcImageFilePath
    }),

    ...mapGetters("BMC", {
      bmcConfListText: "bmcConfListText",
      bmcConfListForUpdate: "bmcConfListForUpdate"
    }),

    startReady: function() {
      // console.log(scopeRow)

      return function(scopeRow) {
        return (this.file !== null &&
          scopeRow.imageUpdateStates == "connect") ||
          scopeRow.imageUpdateStates == "connectTimeOut" ||
          scopeRow.imageUpdateStates == "logout" ||
          scopeRow.imageUpdateStates == "flashFinish"
          ? false
          : true;
      };
    }
  },
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  methods: {
    handleSelectionChange(val) {
      // 获取选中的值
      this.selectionData = val;
    },
    showLoginWayType(value) {
      console.log(value);
    },
    // 编辑 BMC 刷新信息
    editBmcConf(bmcConf) {
      console.log(bmcConf);
      this.FormVisible = true;
      this.editMachineInfo = bmcConf;
    },

    deletBmcConf(bmcConf) {
      console.log(bmcConf);
      this.$store.commit("BMC/deleteBmcMachine", bmcConf);
    },
    saveEditeInfo(value) {
      console.log(value);
      this.FormVisible = false;
      this.$store.commit("BMC/setBmcMachine", value);
    },
    hideEditeInfo() {
      this.FormVisible = false;
    },
    saveBmcConf() {
      saveConfFile(this.bmcFlashList);
    },

    bmcFlashAll() {
      let selectedMachineItme = this.$refs.MachineTable.selection;
      selectedMachineItme.forEach(bmcConf => {
        this.startBmcUpdateWithSingle(bmcConf);
      });
    },
    // 开始更新一台机器
    // 1. 获取 Cookie 信息
    startBmcUpdateWithSingle(bmcConf) {
      // 构造表单登录信息

      // 开始发起登录请求
      this.bmcFlashList[bmcConf.id].imageUpdateStates = "connecting";
      let userInfo = Qs.stringify({
        username: bmcConf.username,
        password: bmcConf.password
      });

      const api_login_interface = "/api/session";

      let postOptions = {
        method: "POST",
        protocol: `${bmcConf.login_way_type}:`,
        hostname: `${bmcConf.bmc_ip}`,
        port: bmcConf.login_way_type.toLowerCase() == "https" ? 443 : 80,
        path: api_login_interface,

        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      };
      const request = net.request(postOptions);

      request.write(userInfo);

      let resResult = {
        "X-CSRFTOKEN": null,
        Cookie: null,
        statusCode: null,
        errMessage: null,
        sessionID: null
      };

      request.on("response", response => {
        console.log(`STATUS: ${response.statusCode}`);

        resResult.statusCode = response.statusCode;
        if (this._.has(response.headers, "set-cookie")) {
          let sessionReg = /(QSESSIONID=[a-zA-Z0-9]+);/gi;
          let setCoockie = response.headers["set-cookie"][0];
          // console.log(setCoockie)
          let matchResult = setCoockie.match(sessionReg);
          if (matchResult.length > 0) {
            resResult.Cookie = matchResult[0] + "refresh_disable=1";
          }
        } else {
          // 登陆错误也会返回 状态吗 200，需要区分
          // 这儿是 BMC 后端返回状态码使用错误问题， 这儿修正
          resResult.errMessage = "密码用户名不正确";
          resResult.statusCode = 401;
        }

        // return response;
        response.on("data", chunk => {
          let chunkToString = chunk.toString();
          let jsonData = JSON.parse(chunkToString);

          if (this._.has(jsonData, "CSRFToken")) {
            resResult["X-CSRFTOKEN"] = jsonData["CSRFToken"];
            this.bmcFlashList[bmcConf.id].imageUpdateStates =
              "prepareFlashArea";
            this.bmcFlashList[bmcConf.id].sessionID = jsonData["racsession_id"];
          }

          switch (resResult.statusCode) {
            case 200:
              {
                this.bmcFlashList[bmcConf.id].imageUpdateStates =
                  "prepareFlashArea";

                const axiosInstance = this.$http.create({
                  baseURL: `${bmcConf.login_way_type}://${bmcConf.bmc_ip}/`,
                  timeout: 120 * 1000,
                  headers: {
                    "X-CSRFTOKEN": resResult["X-CSRFTOKEN"]
                  }
                });

                this.startUpdateBmcTask(axiosInstance, bmcConf);
              }
              break;
            case 401: {
              this.$notify({
                title: `${bmcConf.bmc_ip} 错误通知`,
                message: this.$createElement(
                  "i",
                  { style: "color: red" },
                  `无法获取机器Token,请确认机器信息`
                )
              });
              this.bmcFlashList[bmcConf.id].imageUpdateStates = "loginFailed";
              break;
            }
            default: {
              this.$notify({
                title: `${bmcConf.bmc_ip} 错误通知`,
                message: this.$createElement(
                  "i",
                  { style: "color: red" },
                  `未知错误`
                )
              });
              break;
            }
          }
        });

        response.on("error", error => {
          console.log(`响应 ERROR: ${JSON.stringify(error)}`);
          this.$notify({
            title: `${bmcConf.bmc_ip} 错误通知`,
            message: this.$createElement(
              "i",
              { style: "color: red" },
              `响应 ERROR￥`
            )
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
          this.bmcFlashList[bmcConf.id].imageUpdateStates = "connectTimeOut";
          this.$notify({
            title: `${bmcConf.bmc_ip} 超时通知`,
            message: this.$createElement(
              "i",
              { style: "color: teal" },
              `机器长时间无响应，请检查机器状态和配置信息`
            )
          });
        } else {
          resResult.statusCode = 500;

          this.bmcFlashList[bmcConf.id].imageUpdateStates = "abort";

          this.$notify({
            title: `${bmcConf.bmc_ip} 请求错误通知`,
            message: this.$createElement(
              "i",
              { style: "color: red" },
              `获取机器Token发生错误`
            )
          });
        }
      });

      request.end();
    },
    // GET 测试接口
    getDashBoardEvent(axiosInstance) {
      const apiName = "api/logs/dashboardevent";
      console.log("getDashBoardEvent ==> ");

      return axiosInstance({
        method: "GET",
        url: apiName
      });
    },

    startUpdateBmcTask(axiosInstance, bmcConf) {
      const _parent = this;

      // 1. 准备 BMC 环境，成功后开始上传 BMC 超时限定 180s
      // PUT
      this.preBmcFlash(axiosInstance)
        .then(function(res) {
          console.log("========pre=========");
          console.log(res);
          bmcConf.imageUpdateStates = "uploadBMCRom";
          return _parent.uploadBmcRom(axiosInstance, bmcConf);
        })

        //  2. 开始验证
        .then(res => {
          if (res) {
            bmcConf.imageUpdateStates = "verifyRom";
            return _parent.verifyRom(axiosInstance);
          }
        })

        // 3. 验证结束，开始刷新
        .then(res => {
          if (res) {
            bmcConf.imageUpdateStates = "flashBMCRom";
            _parent.flashBMCRom(axiosInstance).then(() => {
              _parent.getFlashBmcProgress(axiosInstance, bmcConf);
            });
          }
        })
        .catch(err => {
          console.log(err);
          let errMessage = `
          <div>
            IP: ${(err.config.baseURL + err.config.url).trim()}
            <br>
            Code: ${err.response.data.code}
            <br>
            Error: ${err.response.data.error}
          </div>
          `;
          this.$notify.error({
            title: "刷新过程发生错误",
            dangerouslyUseHTMLString: true,
            message: errMessage
          });

          bmcConf.imageUpdateStates = bmcConf.imageUpdateStates + "Failed";
          // 重启 BMC 
          _parent.flashReset(axiosInstance)
        });
    },
    // 注销退出接口
    logout(axiosInstance, bmcConf) {
      const apiName = `api/settings/service-sessions/${bmcConf.sessionID}`;
      console.log(`[DEBUG API] + logout ==> ${apiName}`);
      return axiosInstance.post(apiName);
    },

    // BMC 环境预处理
    preBmcFlash(axiosInstance) {
      const apiName = `api/maintenance/flash`;
      return axiosInstance.put(apiName);
    },
    // 上传 BMC Rom
    // 超时时间 180 s
    uploadBmcRom(axiosInstance, bmcConf) {
      const apiName = `api/maintenance/firmware`;
      let forms = new FormData();

      forms.append("fwimage", this.file);

      return axiosInstance.post(apiName, forms, {
        headers: {
          "Conten-Type": "application/x-www-form-urlencoded"
        },
        timeout: 240 * 1000,

        onUploadProgress: progressEvent => {
          let complete =
            ((progressEvent.loaded / progressEvent.total) * 100) | 0;
          console.log(complete);
          bmcConf.imageUpdateStates = `当前上传进度： ${complete}%`;
        }
      });
    },

    verifyBMCRom(axiosInstance) {
      const apiName = `api/maintenance/firmware/verification`;
      // 验证超时时间
      return axiosInstance.get(apiName, {
        timeout: 120 * 1000
      });
    },

    flashBMCRom(axiosInstance) {
      const apiName = `api/maintenance/firmware/upgrade`;
      const data = { preserve_config: 0, flash_status: 1 };

      return axiosInstance.put(apiName, data, {
        timeout: 180 * 1000
      });
    },

    getFlashBmcProgress(axiosInstance, bmcConf) {
      let _parent = this;
      const apiName = `api/maintenance/firmware/flash-progress`;

      // while(true) {
      axiosInstance
        .get(apiName)
        .then(res => {
          console.log("*********************");
          console.log(res);
          if (res.data) {
            let progress = parseInt(res.data.progress, 10);
            console.log(progress);
            bmcConf.imageUpdateStates = `刷新进度 (${progress}%)  `;
          }
          console.log(res.data.state);

          if (res.data.state != 2) {
            _parent.getFlashBmcProgress.call(_parent, axiosInstance, bmcConf);
          } else {
            // 刷新完毕
            bmcConf.imageUpdateStates = "flashFinish";
            _parent.flashReset.call(_parent, axiosInstance, bmcConf);
            // _parent.logout.call(_parent, axiosInstance, bmcConf);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    flashReset(axiosInstance) {
      const apiName = `api/maintenance/reset`;
      return axiosInstance.post(apiName);
    },


    getFullApiPath(conf, apiName) {
      return `${conf.login_way_type}://${conf.bmc_ip}/${apiName}`;
    }
  }
};
</script>

<style lang="less" scoped>
.bmc-update-box {
  margin-top: 20px;
  margin-right: 50px;
  text-align: right;
  color: #bebebe;
}
.page-bmc-opearation-box {
  margin-top: 20px;
  text-align: center;
}
</style>
