export const ImageUpdateStates = {
  connect: "等待检测连接",
  connecting: "连接中",

  connectTimeOut: "连接超时...",
  login: "等待登录",

  loginFailed: "登录验证错误",

  prepareFlashArea: "开始设置机器环境",
  prepareFlashAreaFailed: "设置机器环境失败",

  uploadBIOSRom: "上传镜像: 当前进度 ",
  uploadBIOSRomFailed: "上传镜像失败",

  verifyRom: "验证镜像中...",
  verifyRomFailed: "验证镜像失败",
  flashBIOSRom: "开始刷新",
  flashBIOSRomFailed: "开始刷新出现错误",

  getFlashProgress: "刷新进度",
  getFlashProgressFailed: "获取刷新进度失败",
  flashFinish: "刷新完毕",
  stop: "结束",
  abort: "异常结束更新",
  logout: "退出",
  logoutFailed: "退出失败"
};
