import _ from "lodash";
const { dialog } = require("electron").remote;
const fs = require("fs");

function saveConfFile(jsonData) {
  dialog
    .showSaveDialog({
      title: "请选择要保存的文件名",
      buttonLabel: "保存",
      filters: [{ name: "文件类型", extensions: ["json"] }]
    })
    .then(result => {
      // 去除不必要的属性
      let Data = _.map(jsonData, itme =>
        _.omit(itme, ["id", "imageUpdateStates", "sessionID"])
      );
      fs.writeFileSync(result.filePath, JSON.stringify(Data, null, 4));
      console.log(result);
    })
    .catch(err => {
      console.log(err);
    });
}

export { saveConfFile };
