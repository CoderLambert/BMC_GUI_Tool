import logger from "electron-log";

logger.transports.file.level = "info";
logger.info("Logger init");
logger.warn("[BMC UI] Logger init");

export default logger;
