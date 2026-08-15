import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { polygonAmoy } from 'viem/chains';
import { http } from 'wagmi';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '3a8170812b534d0ff9d794f168fa4d80';

export const config = getDefaultConfig({
  appName: 'AI Code Battle Arena',
  projectId: projectId,
  chains: [polygonAmoy],
  transports: {
    [polygonAmoy.id]: http('https://polygon-amoy-bor-rpc.publicnode.com'),
  },
  ssr: true,
});