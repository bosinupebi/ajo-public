import { http, cookieStorage, createConfig, createStorage } from "wagmi";
import { classic, mainnet } from "wagmi/chains";
import { injected } from "wagmi/connectors";

export function GetConfig() {
  return createConfig({
    chains: [classic, mainnet],
    connectors: [injected()],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [classic.id]: http(),
      [mainnet.id]: http(),
    },
  });

}

