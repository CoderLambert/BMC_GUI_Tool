"use strict";
import { app } from "electron";

import { EventEmitter } from "events";
import logger from "./Logger";
import ProtocolManager from "./ProtocolManager";
import WindowManager from "../ui/WindowManager";

const isDevelopment = process.env.NODE_ENV !== "production";

export default class ApplicationManager extends EventEmitter {
  constructor(options = {}) {
    super();
    this.options = options;
    this.win = null;
    this.windowManager = null;

    this.protocolManager = null;
    this.init();
    this.afterInit();
  }

  init() {
    logger.info("[BMC UI] ApplicationManager init");
    // 设置默认协议类型
    // Scheme must be registered before the app is ready
    this.initProtocol();

    this.initApp();

    this.initMainWindow();
  }

  initApp() {
    this.initAppCommandLine();
    this.initWhenAppActive();
    this.initOnAppReady();
    this.initWhenAppReady();
    this.initWindowAllClosed();
  }

  afterInit() {
    // Exit cleanly on request from parent process in development mode.
    if (isDevelopment) {
      if (process.platform === "win32") {
        process.on("message", data => {
          if (data === "graceful-exit") {
            app.quit();
          }
        });
      } else {
        process.on("SIGTERM", () => {
          app.quit();
        });
      }
    }
  }

  initProtocol() {
    this.protocolManager = new ProtocolManager();
  }

  // 需要在 app 模块的 ready 事件生效之前，使用app.commandLine.appendSwitch将它们附加到您的应用程序的主要脚本中
  initAppCommandLine() {
    logger.info("[BMC UI DEBUG] 初始化谷歌命令行 ");

    // https://www.bookstack.cn/read/electron-v6.0-zh/5aafd89828bd607b.md
    // 忽略证书验证错误  net::ERR_CERT_AUTHORITY_INVALID
    app.commandLine.appendSwitch("--ignore-certificate-errors", "true");
    //解决10.X版本跨域不成功问题(上线删除)
    // Access to XMLHttpRequest at 'https://10.8.20.121/api/session' from origin 'app://.'
    // has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
    app.commandLine.appendSwitch("disable-features", "OutOfBlinkCors");
  }

  initOnAppReady() {
    logger.info("[BMC UI DEBUG] initOnAppReady ");

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.on("ready", async () => {
      this.win = this.windowManager.createWindow();
    });
  }

  initWhenAppReady() {
    logger.info("[BMC UI DEBUG] initWhenAppReady ");

    app.whenReady().then(() => {
      logger.info("[BMC UI DEBUG] app.whenReady ==》 registerFileProtocol  ");
      this.protocolManager.registerFileProtocol();
    });
  }

  initWhenAppActive() {
    app.on("activate", () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (this.win === null) {
        this.win = this.windowManager.createWindow();
      }
    });
  }

  initWindowAllClosed() {
    // Quit when all windows are closed.
    app.on("window-all-closed", () => {
      // On macOS it is common for applications and their menu bar
      // to stay active until the user quits explicitly with Cmd + Q
      if (process.platform !== "darwin") {
        app.quit();
      }
    });
  }

  initMainWindow() {
    this.windowManager = new WindowManager();
  }
}
