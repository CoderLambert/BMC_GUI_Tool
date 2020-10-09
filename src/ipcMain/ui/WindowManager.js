import { EventEmitter } from "events";
import { app, BrowserWindow } from "electron";
import logger from "../core/Logger";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";

// const defaultBrowserOptions = {
//   titleBarStyle: "hiddenInset",
//   useContentSize: true,
//   show: false,
//   width: 1024,
//   height: 768
// };

export default class WindowManager extends EventEmitter {
  constructor(options = {}) {
    super();
    this.win = null;
    this.options = options;
    this.windowWidth = this.options["windowWidth"] || 800;
    this.windowHeight = this.options["windowHeight"] || 600;

    this.manWindowConfig = {
      width: this.windowWidth,
      height: this.windowHeight,
      webPreferences: {
        // 保证 web 渲染进程集成 nodejs 能力
        nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
        webSecurity: false
      }
    };
    this.init();
  }
  init() {}

  createWindow() {
    // Create the browser window.
    this.win = new BrowserWindow(this.manWindowConfig);

    if (process.env.WEBPACK_DEV_SERVER_URL) {
      // Load the url of the dev server if in development mode
      this.win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
      if (!process.env.IS_TEST) this.win.webContents.openDevTools();
    } else {
      createProtocol("app");
      // Load the index.html when not in development
      this.win.loadURL("app://./index.html");
    }

    this.win.on("closed", () => {
      this.win = null;
    });

    return this.win;
  }
}
