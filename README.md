# relay

install dependencies
```
npm i
```

copy config
```
cp config_example.json config_bootnode.json && cp config_example.json config_relay_1.json && cp config_example.json config_relay_2.json
```
generate privatekey
```
npm run privatekey
```

edit config_bootnode.json
```
"type": "bootnode",
"privateKey": "OUTPUT FROM npm run privatekey",
"addresses": {
  "listen": ["/ip4/0.0.0.0/tcp/4040", "/ip4/0.0.0.0/tcp/4041/ws"],
  "announce": [
    "/ip4/____IP_EXTERNAL____/tcp/4040",
    "/ip4/____IP_EXTERNAL____/tcp/4041/ws"
  ]
},
```

run bootnode
```
npm run start:bootnode
```

edit config_relay_1.json and edit config_relay_2.json
```
"privateKey": "OUTPUT FROM npm run privatekey",
"addresses": {
  "listen": ["/ip4/0.0.0.0/tcp/4040", "/ip4/0.0.0.0/tcp/4041/ws"],
  "announce": [
    "/ip4/____IP_EXTERNAL____/tcp/4040",
    "/ip4/____IP_EXTERNAL____/tcp/4041/ws",
    "/dns4/____DOMAIN.COM____/tcp/443/wss"
  ]
},
"bootstrappers": ["/ip4/____IP_BOOTNODE____/tcp/4040/p2p/____PEER_ID_BOOTNODE____"],
```

run relay
```
npm run start:relay:1
npm run start:relay:2
```
