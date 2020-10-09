"use strict";
import { ipcMain } from "electron";
// import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import ApplicationManager from "@/ipcMain/core/ApplicationManager";
import logger from "@/ipcMain/core/Logger";

let applicationManager = new ApplicationManager();

ipcMain.on("window-reload", (event, arg) => {
  console.log("window-reload"); // prints "ping"
  logger.info("[BMC UI] window-reload");
  applicationManager.win.reload();
  // event.reply('asynchronous-reply', 'pong')
});
