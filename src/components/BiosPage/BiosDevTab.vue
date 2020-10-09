<template>
  <div class="bios-dev-page">
    <div class="page-body">
      <div class="bios-conf">
        <el-button type="success"  @click="openConfFile">选取配置文件...</el-button>
      </div>
      <el-row v-show="biosConfListText != 'null'">
        <el-col :span="24" class="page-bios-conf-box split">
          <h3>配置信息</h3>
          <!-- <p>文件路径: {{ biosConfFilePath }}</p> -->
          <pre class="page-bios-conf">{{ biosConfListText }}</pre>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from "vuex";

const { dialog } = require("electron").remote;
const fs = require("fs");
const { ipcRenderer } = require("electron");

export default {
  name: "BiosDevTable",
  data() {
    return {};
  },
  mounted() {
    let preBiosConfFile = localStorage.getItem("BiosConfList");
    let preBiosImgFilePath = localStorage.getItem("BiosImgFilePath");
    fs.exists(preBiosConfFile, exists => {
      exists ? this.readBiosConfFile(preBiosConfFile) : false;
    });

    fs.exists(preBiosImgFilePath, exists => {
      exists ? this.setImgFilePath(preBiosImgFilePath) : false;
    });
  },

  computed: {
    ...mapState("BIOS", {
      biosConfList: state => state.biosConfList,
      biosFlashList: state => state.biosFlashList,
      biosConfFilePath: state => state.biosConfFilePath,
      biosImageFilePath: state => state.biosImageFilePath
    }),

    ...mapGetters("BIOS", {
      biosConfListText: "biosConfListText"
    })
  },

  methods: {
    openConfFile() {
      dialog
        .showOpenDialog({
          title: "请选择批量更新BIOS配置文件",
          defaultPath: "settings.json",
          filters: [{ name: "json", extensions: ["json"] }]
        })
        .then(result => {
          if (!result.canceled) {
            this.readBiosConfFile(result.filePaths[0]);
            // store.set("BiosConfList", result.filePaths[0]);
            localStorage.setItem("BiosConfList", result.filePaths[0]);
            // ipcRenderer.send("window-reload");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    readBiosConfFile(FilePath) {
      let filePath = FilePath;
      let rawdata = fs.readFileSync(filePath);

      try {
        let jsonData = JSON.parse(rawdata);
        this.$store.commit(
          "BIOS/setBiosConfList",
          this._.isArray(jsonData) ? jsonData : [jsonData]
        );
      
        // console.log(json_data)
        let target = jsonData;
        if (jsonData !== null) {
          target = jsonData.map(function(itme, index) {
            itme.imageUpdateStates = "connect";
            itme.id = index;
            return itme;
          });
        }

        this.$store.commit(
          "BIOS/setBiosFlashList",
          this._.isArray(target) ? target : [target]
        );      

        this.$store.commit("BIOS/setBiosConfFilePath", filePath);
      } catch (error) {
        alert("该文件无法解析为json格式,请检查文件格式是否正确");
      }
    },

    setImgFilePath(filePath) {
      this.$store.commit("BIOS/setBiosImageFilePath", filePath);
    },

    openImgFile() {
      dialog
        .showOpenDialog({
          title: "请选择 BIOS 镜像",
          defaultPath: "image.bin",
          filters: [{ name: "image", extensions: ["bin", "rom"] }]
        })
        .then(result => {
          if (!result.canceled) {
            let filePath = result.filePaths[0];
            this.setImgFilePath(filePath);
            localStorage.setItem("BiosImgFilePath", filePath);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },

  ...mapMutations("BIOS", ["setBiosConfList", "setBiosConfFilePath", "setBiosFlashList"])
};
</script>

<style lang="less" scoped>

.bios-conf {
  text-align: center;
  margin: 0 auto;
  .el-button {
    width: 300px;
    height: 40px;
    background: #2ea169;
  }
}
.bios-dev-page {
  .page-title {
    color: var(--page-title-color);
  }
  .page-body {
    margin-top: 20px;
    .page-bios-conf-box {
      padding: 0 40px;
    }
    .split {
      border-right: 1px solid #eee;
    }
    .page-bios-conf {
      // margin: 20px;
      padding: 20px;
      font-size: 14px;
      border-radius: 20px;
      background: #ededed;
    }
  }
}
</style>
