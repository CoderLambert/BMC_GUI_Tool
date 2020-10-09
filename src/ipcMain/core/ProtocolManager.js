import { protocol } from "electron";
import { EventEmitter } from "events";
import logger from "./Logger";
import slash from "slash";

export default class ProtocolManager extends EventEmitter {
  constructor(options = {}) {
    super();
    this.options = options;
    this.init();
  }

  init() {
    this.registerAppProtocol();
  }

  registerAppProtocol() {
    logger.info(`[BMC UI] protocol app:`);

    protocol.registerSchemesAsPrivileged([
      { scheme: "app", privileges: { secure: true, standard: true } }
    ]);
  }

  registerFileProtocol() {
    // 拦截 scheme 协议并且使用 handler 作为协议的新的句柄来发送响应文件.
    protocol.interceptFileProtocol(
      "file",
      (req, callback) => {
        const url = req.url.substr(8);
        callback(slash(decodeURI(url)));
        logger.info("register local file protocol");
      },
      error => {
        if (error) {
          logger.error("Failed to register protocol");
        }
      }
    );
  }
}
