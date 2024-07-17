import { app } from "./app.js";
import * as configNode from "./config.js";
import { getConfigFile } from "./utils.js";

(async () => {
  const config = getConfigFile();
  if (config.type === "relay") {
    console.log("=== start relay ===");
    app(await configNode.relay(config));
  } else {
    console.log("=== start bootnode ===");
    app(await configNode.bootnode(config));
  }
})();
