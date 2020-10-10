<template>
  <div class="bios-dev-page">
    <div class="page-body">
      <div class="bios-conf">
        <el-button type="success" @click="openConfFile"
          > <span>选取 BIOS 配置文件...</span></el-button
        >
      </div>

      <JsonInfo
        :jsonInfo="biosConfListText"
        :filePath="biosConfFilePath"
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
  name: "BiosDevTable",
  data() {
    return {};
  },
  mounted() {
    let preBiosConfFile = localStorage.getItem("BiosConfList");
    let preBiosImgFilePath = localStorage.getItem("BiosImgFilePath");
    fs.exists(preBiosConfFile, exists => {
      exists ? this.readFileInfo(preBiosConfFile) : false;
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
            this.readFileInfo(result.filePaths[0]);
            // store.set("BiosConfList", result.filePaths[0]);
            localStorage.setItem("BiosConfList", result.filePaths[0]);
            // ipcRenderer.send("window-reload");
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
          "BIOS/setBiosConfList",
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
  components: {
    JsonInfo
  },
  ...mapMutations("BIOS", [
    "setBiosConfList",
    "setBiosConfFilePath",
    "setBiosFlashList"
  ])
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
