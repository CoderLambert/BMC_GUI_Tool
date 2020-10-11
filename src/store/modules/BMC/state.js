const state = {
  // 获取原始 json文件数据
  bmcConfList: null,
  // 更新时，需要在 bmcConfList 数据基础上添加 ID、seesionID、imageUpdateStatus 属性，
  // 用来跟踪定位回话和更新状态
  bmcFlashList: null,
  // 配置文件路径
  bmcConfFilePath: null,

  bmcImageFile: null,
  bmcImageFilePath: null
};
export default state;
