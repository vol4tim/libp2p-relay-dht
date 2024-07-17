import { createLibp2p } from "libp2p";
import { logger } from "./utils.js";

export async function app(config) {
  const node = await createLibp2p(config);

  logger(`Node started with id ${node.peerId.toString()}`);
  logger("Listening on:");
  node.getMultiaddrs().forEach(ma => console.log(ma.toString()));

  function updateConnectionsList() {
    const connections = node.getConnections().map(item => {
      return item.remoteAddr.toString();
    });
    logger("Update Connections List", connections);
  }

  node.addEventListener("connection:open", event => {
    logger("connected", event.detail.remoteAddr.toString());
    updateConnectionsList();
  });

  node.addEventListener("connection:close", event => {
    logger("disconected", event.detail.remoteAddr.toString());
    updateConnectionsList();
  });

  node.addEventListener("peer:discovery", evt => {
    const peerInfo = evt.detail;
    console.log("Discovered:", peerInfo.id.toString());
  });
}
