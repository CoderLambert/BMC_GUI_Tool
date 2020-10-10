<template>
  <div class="bios-dev-page">
    <div class="page-body">
      <div class="bios-conf">
        <el-button type="success" @click="openConfFile"
          ><span>选取 BMC 配置文件...</span></el-button
        >
      </div>

      <JsonInfo
        :jsonInfo="bmcConfListText"
        :filePath="bmcConfFilePath"
      ></JsonInfo>
    </div>
  </div>
</template>

<script>
import JsonInfo from "../JsonInfo";
import { mapState, mapMutations, mapGetters } from "vuex";
const { dialog } = require("electron").remote;
const fs = require("fs");

export default {
  name: "BmcConf",
  data() {
    return {};
  },
  mounted() {
    let preBmcConfFile = localStorage.getItem("BmcConfList");
    let preBmcImgFilePath = localStorage.getItem("BmcImgFilePath");
    fs.exists(preBmcConfFile, exists => {
      exists ? this.readFileInfo(preBmcConfFile) : false;
    });

    fs.exists(preBmcImgFilePath, exists => {
      exists ? this.setImgFilePath(preBmcImgFilePath) : false;
    });
  },

  computed: {
    ...mapState("BMC", {
      bmcConfList: state => state.bmcConfList,
      bmcFlashList: state => state.bmcFlashList,
      bmcConfFilePath: state => state.bmcConfFilePath,
      bmcImageFilePath: state => state.bmcImageFilePath
    }),

    ...mapGetters("BMC", {
      bmcConfListText: "bmcConfListText"
    })
  },
  methods: {
    openConfFile() {
      dialog
        .showOpenDialog({
          title: "请选择批量更新BMC配置文件",
          defaultPath: "settings.json",
          filters: [{ name: "json", extensions: ["json"] }]
        })
        .then(result => {
          if (!result.canceled) {
            this.readFileInfo(result.filePaths[0]);
            localStorage.setItem("BmcConfList", result.filePaths[0]);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    readFileInfo(FilePath) {
      let filePath = FilePath;
      let rawdata = fs.readFileSync(filePath);

      try {
        let jsonData = JSON.parse(rawdata);
        this.$store.commit(
          "BMC/setBmcConfList",
          this._.isArray(jsonData) ? jsonData : [jsonData]
        );

        let target = this._.cloneDeep(jsonData);
        if (target !== null) {
          target = target.map(function(itme, index) {
            itme.imageUpdateStates = "connect";
            itme.id = index;
            return itme;
          });
        }

        this.$store.commit(
          "BMC/setBmcFlashList",
          this._.isArray(target) ? target : [target]
        );

        this.$store.commit("BMC/setBmcConfFilePath", filePath);
      } catch (error) {
        alert("该文件无法解析为json格式,请检查文件格式是否正确");
      }
    },

    setImgFilePath(filePath) {
      this.$store.commit("BMC/setBmcImageFilePath", filePath);
    },

    openImgFile() {
      dialog
        .showOpenDialog({
          title: "请选择 BMC 镜像",
          defaultPath: "image.bin",
          filters: [{ name: "image", extensions: ["bin", "rom"] }]
        })
        .then(result => {
          if (!result.canceled) {
            let filePath = result.filePaths[0];
            this.setImgFilePath(filePath);
            localStorage.setItem("BmcImgFilePath", filePath);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    ...mapMutations("BMC", [
      "setBmcConfList",
      "setBmcConfFilePath",
      "setBmcFlashList"
    ])
  },

  components: {
    JsonInfo
  }
};
</script>

<style lang="less" scoped>
.bios-conf {
  text-align: center;
  margin: 0 auto;
  .el-button {
    width: 300px;
    height: 50px;
    background: #2ea169;
    span {
      font-size: 1.3em;
      font-weight: 600;
    }
    &:hover{
      opacity: 0.8;
    }
  }
}
.bios-dev-page {
  .page-title {
    color: var(--page-title-color);
  }
  .page-body {
    margin-top: 20px;
  }
}
</style>
