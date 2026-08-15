export const BATTLE_ARENA_ADDRESS = (process.env.NEXT_PUBLIC_BATTLE_ARENA_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`;
export const REPUTATION_NFT_ADDRESS = (process.env.NEXT_PUBLIC_REPUTATION_NFT_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`;

export const BATTLE_ARENA_ABI = [
  {
    "type": "function",
    "name": "stake",
    "inputs": [{ "name": "roomId", "type": "string" }],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "refund",
    "inputs": [{ "name": "roomId", "type": "string" }],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "battles",
    "inputs": [{ "name": "", "type": "string" }],
    "outputs": [
      { "name": "roomId", "type": "string" },
      { "name": "player1", "type": "address" },
      { "name": "player2", "type": "address" },
      { "name": "stakeAmount", "type": "uint256" },
      { "name": "player1Staked", "type": "bool" },
      { "name": "player2Staked", "type": "bool" },
      { "name": "isSettled", "type": "bool" },
      { "name": "winner", "type": "address" }
    ],
    "stateMutability": "view"
  }
] as const;

export const REPUTATION_NFT_ABI = [
  {
    "type": "function",
    "name": "userWinCount",
    "inputs": [{ "name": "", "type": "address" }],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  }
] as const;