export const BATTLE_ARENA_ADDRESS = (process.env.NEXT_PUBLIC_BATTLE_ARENA_ADDRESS || "0x93B16c50a8251C0997B2A0bE02F4a28f0533eda2") as `0x${string}`;
export const REPUTATION_NFT_ADDRESS = (process.env.NEXT_PUBLIC_REPUTATION_NFT_ADDRESS || "0xB12a4C4472415AEF879aDa91Ff67627f69b136cB") as `0x${string}`;

export const STAKE_TIERS = [
  { id: 'free', label: 'Free (0 POL)', amount: '0', desc: 'Casual Practice' },
  { id: 'micro', label: '0.002 POL', amount: '0.002', desc: '40+ Battles/Day' },
  { id: 'standard', label: '0.005 POL', amount: '0.005', desc: '15-20 Battles/Day' },
  { id: 'duel', label: '0.010 POL', amount: '0.010', desc: '10 Battles/Day' },
] as const;

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
    "name": "claimPrize",
    "inputs": [{ "name": "roomId", "type": "string" }],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "settleBattle",
    "inputs": [
      { "name": "roomId", "type": "string" },
      { "name": "winner", "type": "address" },
      { "name": "problemTitle", "type": "string" },
      { "name": "winnerScore", "type": "uint256" },
      { "name": "tokenUri", "type": "string" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
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
    "name": "claimBadge",
    "inputs": [
      { "name": "tokenUri", "type": "string" },
      { "name": "problemTitle", "type": "string" },
      { "name": "score", "type": "uint256" }
    ],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "mintWinnerBadge",
    "inputs": [
      { "name": "recipient", "type": "address" },
      { "name": "tokenUri", "type": "string" },
      { "name": "problemTitle", "type": "string" },
      { "name": "score", "type": "uint256" }
    ],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "userWinCount",
    "inputs": [{ "name": "", "type": "address" }],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "balanceOf",
    "inputs": [{ "name": "owner", "type": "address" }],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  }
] as const;