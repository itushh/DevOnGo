import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
  lightTheme,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  sepolia,
  polygonMumbai,
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

import { defineChain, createPublicClient, http } from 'viem';

export const helaTestnet = defineChain({
  id: 666888,
  name: 'HeLa Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'HLUSD',
    symbol: 'HLUSD',
  },
  rpcUrls: {
    default: { http: ['https://testnet-rpc.helachain.com'] },
  },
  blockExplorers: {
    default: { name: 'HeLa Explorer', url: 'https://testnet-blockexplorer.helachain.com' },
  },
  testnet: true,
});

export const config = getDefaultConfig({
  appName: 'Web3Quest',
  projectId: 'YOUR_PROJECT_ID',
  chains: [helaTestnet, sepolia, polygonMumbai],
  ssr: true,
});


export const queryClient = new QueryClient();

export const publicClient = createPublicClient({
  chain: helaTestnet,
  transport: http()
});

export { RainbowKitProvider, WagmiProvider, lightTheme };
