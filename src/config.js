import { noise } from "@chainsafe/libp2p-noise";
import { yamux } from "@chainsafe/libp2p-yamux";
import { bootstrap } from "@libp2p/bootstrap";
import { circuitRelayServer } from "@libp2p/circuit-relay-v2";
import { identify } from "@libp2p/identify";
import { kadDHT } from "@libp2p/kad-dht";
import { mplex } from "@libp2p/mplex";
import { tcp } from "@libp2p/tcp";
import { webSockets } from "@libp2p/websockets";
import * as filters from "@libp2p/websockets/filters";
import { createPeer } from "./utils.js";

export async function bootnode(config) {
  const nodeConfig = {
    addresses: config.addresses,
    peerId: await createPeer(config.privateKey),
    transports: [
      tcp(),
      webSockets({
        filter: filters.all
      })
    ],
    connectionEncryption: [noise()],
    streamMuxers: [
      yamux(),
      mplex({
        maxStreamBufferSize: 10000000,
        maxMsgSize: 131072 * 100
      })
    ],
    services: {
      identify: identify(),
      kadDHT: kadDHT({
        protocol: config.protocolDHT
      })
    },
    connectionManager: config.connectionManager || {}
  };

  if (config.bootstrappers && config.bootstrappers.length) {
    nodeConfig.peerDiscovery = [
      bootstrap({
        list: config.bootstrappers
      })
    ];
  }

  return nodeConfig;
}

export async function relay(config) {
  const nodeConfig = await bootnode(config);

  nodeConfig.services.relay = circuitRelayServer({
    reservations: {
      defaultDataLimit: BigInt(131072 * 10),
      applyDefaultLimit: false,
      maxReservations: 500,
      defaultDurationLimit: 25 * 60 * 1000
    }
  });

  return nodeConfig;
}
