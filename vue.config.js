const path = require("path");

const resolve = dir => path.join(__dirname, dir);

module.exports = {
  publicPath: "./",
  lintOnSave: false,

  devServer: {
    // can be overwritten by process.env.HOST
    host: "0.0.0.0",
    port: 8080
  },

  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true
    },
    builderOptions: {
      nsis: {},
      asar: false
    }
  },

  chainWebpack: option => {
    option.resolve.alias
      .set("@", resolve("src/"))
      .set("lib", resolve("lib/"))
      .set("mainCore", resolve("src/ipcMain/core"))

      .set("common", resolve("src/common"))
      .set("components", resolve("src/components"));

    option.when(process.env.NODE_ENV === "development", config => {
      config
        .entry("app")
        .clear()
        .add("./src/main.js");
    });
    option.when(process.env.NODE_ENV === "production", config => {
      config
        .entry("app")
        .clear()
        .add("./src/main.js");
    });

    //   .set('vue$': 'vue/dist/vue.esm.js');
  }
};
