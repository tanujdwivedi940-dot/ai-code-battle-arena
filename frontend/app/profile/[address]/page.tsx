// // "use client";

// // import { useParams } from 'next/navigation';
// // import { useAccount, useReadContract, useBalance } from 'wagmi';
// // import { 
// //   Award, 
// //   ShieldCheck, 
// //   Trophy, 
// //   Flame, 
// //   ExternalLink, 
// //   Swords, 
// //   Activity, 
// //   Zap, 
// //   CheckCircle2, 
// //   Copy, 
// //   Check,
// //   Calendar,
// //   Lock,
// //   Wallet
// // } from 'lucide-react';
// // import Link from 'next/link';
// // import { useState } from 'react';
// // import { REPUTATION_NFT_ADDRESS, REPUTATION_NFT_ABI } from '@/config/contracts';

// // export default function ProfilePage() {
// //   const params = useParams();
// //   const rawAddress = (params.address as string) || '0x0000000000000000000000000000000000000000';
// //   const { address: connectedAddress } = useAccount();
// //   const [copied, setCopied] = useState(false);

// //   // 🔗 REAL ON-CHAIN READ 1: Query actual user win count from Polygon Amoy
// //   const { data: onChainWinCount } = useReadContract({
// //     address: REPUTATION_NFT_ADDRESS,
// //     abi: REPUTATION_NFT_ABI,
// //     functionName: 'userWinCount',
// //     args: [rawAddress as `0x${string}`],
// //   });

// //   // 🔗 REAL ON-CHAIN READ 2: Query actual Soulbound NFT token balance
// //   const { data: onChainNftBalance } = useReadContract({
// //     address: REPUTATION_NFT_ADDRESS,
// //     abi: REPUTATION_NFT_ABI,
// //     functionName: 'balanceOf',
// //     args: [rawAddress as `0x${string}`],
// //   });

// //   // 🔗 REAL ON-CHAIN READ 3: Query user's real POL wallet balance
// //   const { data: walletBalance } = useBalance({
// //     address: rawAddress as `0x${string}`,
// //   });

// //   const realWins = Number(onChainWinCount || 0);
// //   const realBadgeCount = Number(onChainNftBalance || 0);
// //   const formattedBalance = walletBalance ? parseFloat(walletBalance.formatted).toFixed(4) : '0.0000';

// //   const copyAddress = () => {
// //     navigator.clipboard.writeText(rawAddress);
// //     setCopied(true);
// //     setTimeout(() => setCopied(false), 2000);
// //   };

// //   // Determine Developer Tier based on Real On-Chain Wins
// //   const getDeveloperTier = (wins: number) => {
// //     if (wins >= 25) return { tier: 'Grandmaster S+', color: 'text-amber-400', badge: 'bg-amber-400/20 border-amber-400/40' };
// //     if (wins >= 10) return { tier: 'Master Tier', color: 'text-arena-neonPurple', badge: 'bg-purple-500/20 border-purple-500/40' };
// //     if (wins >= 3) return { tier: 'Diamond Tier', color: 'text-arena-neonCyan', badge: 'bg-cyan-500/20 border-cyan-500/40' };
// //     if (wins >= 1) return { tier: 'Gold Contender', color: 'text-arena-neonGreen', badge: 'bg-emerald-500/20 border-emerald-500/40' };
// //     return { tier: 'Arena Initiate', color: 'text-gray-400', badge: 'bg-gray-800 border-gray-700' };
// //   };

// //   const currentTierInfo = getDeveloperTier(realWins);

// //   // Dynamic Soulbound Badges Gallery (Unlocked dynamically when user wins!)
// //   const allBadges = [
// //     {
// //       id: '1',
// //       title: 'Grandmaster Algorithmist',
// //       problem: 'Two Sum & Fast Hash Map Lookup',
// //       requiredWins: 1,
// //       tier: 'Grandmaster',
// //       color: 'from-amber-400 to-yellow-600',
// //       description: 'Minted for achieving optimal O(N) single-pass time complexity in 1v1 live combat.'
// //     },
// //     {
// //       id: '2',
// //       title: 'O(1) Space Memory Wizard',
// //       problem: 'In-Place Singly Linked List Reversal',
// //       requiredWins: 3,
// //       tier: 'Diamond',
// //       color: 'from-cyan-400 to-blue-600',
// //       description: 'Minted for executing pointer reversal with strictly O(1) auxiliary memory overhead.'
// //     },
// //     {
// //       id: '3',
// //       title: 'Low-Level C Systems Slayer',
// //       problem: 'Pointer Arithmetic & Dynamic Malloc',
// //       requiredWins: 5,
// //       tier: 'Platinum',
// //       color: 'from-purple-500 to-pink-600',
// //       description: 'Mastery over raw memory management, double pointers, and boundary safety.'
// //     },
// //     {
// //       id: '4',
// //       title: 'Dynamic Programming Master',
// //       problem: 'Kadane Maximum Subarray & Coin Change',
// //       requiredWins: 10,
// //       tier: 'Gold',
// //       color: 'from-emerald-400 to-teal-600',
// //       description: 'Optimal state transition formulation with dynamic programming table optimization.'
// //     },
// //   ];

// //   return (
// //     <div className="max-w-6xl mx-auto px-4 py-10 space-y-8 text-left">
      
// //       {/* 1. Top On-Chain Profile Card */}
// //       <div className="bg-arena-card border border-arena-border rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl glow-purple">
// //         <div className="absolute top-0 right-0 w-80 h-80 bg-arena-neonCyan/10 rounded-full blur-[100px] pointer-events-none" />

// //         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
// //           <div className="flex items-center space-x-4">
// //             <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-arena-neonCyan to-arena-neonPurple p-0.5 glow-cyan shrink-0">
// //               <div className="w-full h-full bg-arena-card rounded-2xl flex items-center justify-center font-mono font-bold text-arena-neonCyan text-xl">
// //                 {rawAddress.substring(2, 4).toUpperCase()}
// //               </div>
// //             </div>

// //             <div className="space-y-1">
// //               <div className="flex flex-wrap items-center gap-2">
// //                 <h1 className="text-lg sm:text-2xl font-bold font-mono text-gray-100">
// //                   {rawAddress.substring(0, 8)}...{rawAddress.substring(rawAddress.length - 6)}
// //                 </h1>
// //                 <button
// //                   onClick={copyAddress}
// //                   className="p-1 rounded-lg bg-arena-bg border border-arena-border hover:border-arena-neonCyan text-gray-400 hover:text-white transition"
// //                   title="Copy Wallet Address"
// //                 >
// //                   {copied ? <Check className="w-3.5 h-3.5 text-arena-neonGreen" /> : <Copy className="w-3.5 h-3.5" />}
// //                 </button>
// //                 <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full border text-[10px] font-mono font-bold ${currentTierInfo.badge} ${currentTierInfo.color}`}>
// //                   <ShieldCheck className="w-3 h-3" />
// //                   <span>{currentTierInfo.tier}</span>
// //                 </span>
// //               </div>

// //               <div className="flex items-center space-x-2 text-xs text-gray-400 font-mono">
// //                 <span>Polygon Amoy Network</span>
// //                 <span>•</span>
// //                 <a
// //                   href={`https://amoy.polygonscan.com/address/${rawAddress}`}
// //                   target="_blank"
// //                   rel="noreferrer"
// //                   className="text-arena-neonCyan hover:underline flex items-center space-x-1"
// //                 >
// //                   <span>View on Polygonscan</span>
// //                   <ExternalLink className="w-3 h-3" />
// //                 </a>
// //               </div>
// //             </div>
// //           </div>

// //           <Link
// //             href="/"
// //             className="px-5 py-2.5 bg-gradient-to-r from-arena-neonCyan to-arena-neonPurple text-black font-bold text-xs font-mono rounded-xl hover:scale-105 transition shadow-lg shrink-0 flex items-center space-x-2"
// //           >
// //             <Swords className="w-4 h-4" />
// //             <span>Enter Battle Arena</span>
// //           </Link>
// //         </div>

// //         {/* 📊 Live On-Chain Stats Grid */}
// //         <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-arena-border font-mono">
// //           <div className="bg-arena-bg/60 p-4 rounded-xl border border-arena-border">
// //             <p className="text-xs text-gray-400">Verified On-Chain Wins</p>
// //             <p className="text-2xl font-bold text-arena-neonGreen mt-1">{realWins} Wins</p>
// //           </div>
// //           <div className="bg-arena-bg/60 p-4 rounded-xl border border-arena-border">
// //             <p className="text-xs text-gray-400">Soulbound NFTs (ERC-721)</p>
// //             <p className="text-2xl font-bold text-yellow-400 mt-1">{realBadgeCount} Badges</p>
// //           </div>
// //           <div className="bg-arena-bg/60 p-4 rounded-xl border border-arena-border">
// //             <p className="text-xs text-gray-400">POL Wallet Balance</p>
// //             <p className="text-xl font-bold text-arena-neonCyan mt-1">{formattedBalance} POL</p>
// //           </div>
// //           <div className="bg-arena-bg/60 p-4 rounded-xl border border-arena-border">
// //             <p className="text-xs text-gray-400">Contract Verification</p>
// //             <p className="text-sm font-bold text-gray-300 mt-1 truncate" title={REPUTATION_NFT_ADDRESS}>
// //               {REPUTATION_NFT_ADDRESS.substring(0, 8)}...
// //             </p>
// //           </div>
// //         </div>
// //       </div>

// //       {/* 2. Soulbound NFT Badges Collection */}
// //       <div className="space-y-4">
// //         <div className="flex items-center justify-between">
// //           <div className="flex items-center space-x-2">
// //             <Award className="w-5 h-5 text-arena-neonCyan" />
// //             <h2 className="text-xl font-bold text-gray-100 font-mono">
// //               Soulbound Reputation Badges (ERC-721)
// //             </h2>
// //           </div>
// //           <span className="text-xs font-mono text-gray-400">
// //             {realBadgeCount > 0 ? `${realBadgeCount} Minted on Chain` : 'Badges Earned'}
// //           </span>
// //         </div>

// //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
// //           {allBadges.map((badge, idx) => {
// //             const isUnlocked = realWins >= badge.requiredWins || realBadgeCount > idx;

// //             return (
// //               <div
// //                 key={badge.id}
// //                 className={`bg-arena-card border rounded-2xl p-5 transition duration-300 relative group overflow-hidden shadow-xl flex flex-col justify-between ${
// //                   isUnlocked ? 'border-arena-neonCyan/40 hover:border-arena-neonCyan glow-cyan' : 'border-arena-border/50 opacity-60'
// //                 }`}
// //               >
// //                 <div>
// //                   <div className={`h-24 rounded-xl bg-gradient-to-br ${isUnlocked ? badge.color : 'from-gray-800 to-gray-900'} p-3 flex flex-col justify-between mb-4 shadow-lg`}>
// //                     <div className="flex justify-between items-start">
// //                       {isUnlocked ? (
// //                         <Award className="w-7 h-7 text-black/80" />
// //                       ) : (
// //                         <Lock className="w-6 h-6 text-gray-500" />
// //                       )}
// //                       <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-black/50 text-white backdrop-blur-md rounded-md uppercase">
// //                         {badge.tier}
// //                       </span>
// //                     </div>
// //                     <div className="text-black font-mono font-extrabold text-xs">
// //                       {isUnlocked ? 'Status: Unlocked & Minted' : `Requires ${badge.requiredWins} Win${badge.requiredWins > 1 ? 's' : ''}`}
// //                     </div>
// //                   </div>

// //                   <h3 className="font-bold text-gray-100 text-sm font-mono">{badge.title}</h3>
// //                   <p className="text-xs text-gray-400 mt-1 font-mono leading-relaxed">{badge.description}</p>
// //                 </div>

// //                 <div className="mt-4 pt-3 border-t border-arena-border flex items-center justify-between text-[11px] font-mono text-gray-500">
// //                   <span className="flex items-center space-x-1">
// //                     <Calendar className="w-3 h-3" />
// //                     <span>Season 1</span>
// //                   </span>
// //                   <span className={isUnlocked ? 'text-arena-neonCyan font-bold tracking-wider' : 'text-gray-600 font-bold'}>
// //                     {isUnlocked ? 'SOULBOUND' : 'LOCKED'}
// //                   </span>
// //                 </div>
// //               </div>
// //             );
// //           })}
// //         </div>
// //       </div>

// //     </div>
// //   );
// // }


// "use client";

// import { useParams } from 'next/navigation';
// import { useAccount, useReadContract, useBalance } from 'wagmi';
// import { 
//   Award, 
//   ShieldCheck, 
//   ExternalLink, 
//   Swords, 
//   Copy, 
//   Check,
//   Calendar,
//   Lock
// } from 'lucide-react';
// import Link from 'next/link';
// import { useState } from 'react';
// import { REPUTATION_NFT_ADDRESS, REPUTATION_NFT_ABI } from '@/config/contracts';

// export default function ProfilePage() {
//   const params = useParams();
//   const rawAddress = (params.address as string) || '0x0000000000000000000000000000000000000000';
//   const [copied, setCopied] = useState(false);

//   // 🔗 REAL ON-CHAIN READ 1: Query actual user win count from Polygon Amoy
//   const { data: onChainWinCount } = useReadContract({
//     address: REPUTATION_NFT_ADDRESS,
//     abi: REPUTATION_NFT_ABI,
//     functionName: 'userWinCount',
//     args: [rawAddress as `0x${string}`],
//   });

//   // 🔗 REAL ON-CHAIN READ 2: Query actual Soulbound NFT token balance
//   const { data: onChainNftBalance } = useReadContract({
//     address: REPUTATION_NFT_ADDRESS,
//     abi: REPUTATION_NFT_ABI,
//     functionName: 'balanceOf',
//     args: [rawAddress as `0x${string}`],
//   });

//   // 🔗 REAL ON-CHAIN READ 3: Query user's real POL wallet balance
//   const { data: walletBalance } = useBalance({
//     address: rawAddress as `0x${string}`,
//   });

//   const realWins = Number(onChainWinCount || 0);
//   const realBadgeCount = Number(onChainNftBalance || 0);
//   const formattedBalance = walletBalance ? parseFloat(walletBalance.formatted).toFixed(4) : '0.0000';

//   const copyAddress = () => {
//     navigator.clipboard.writeText(rawAddress);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   const getDeveloperTier = (wins: number) => {
//     if (wins >= 25) return { tier: 'Grandmaster S+', color: 'text-[#F59E0B]', badge: 'bg-[#F59E0B]/10 border-[#F59E0B]/30' };
//     if (wins >= 10) return { tier: 'Master Tier', color: 'text-[#3B82F6]', badge: 'bg-[#3B82F6]/10 border-[#3B82F6]/30' };
//     if (wins >= 3) return { tier: 'Diamond Tier', color: 'text-[#3B82F6]', badge: 'bg-[#3B82F6]/10 border-[#3B82F6]/30' };
//     if (wins >= 1) return { tier: 'Gold Contender', color: 'text-[#22C55E]', badge: 'bg-[#22C55E]/10 border-[#22C55E]/30' };
//     return { tier: 'Arena Initiate', color: 'text-[#94A3B8]', badge: 'bg-[#0F1115] border-[#2A2F38]' };
//   };

//   const currentTierInfo = getDeveloperTier(realWins);

//   const allBadges = [
//     {
//       id: '1',
//       title: 'Grandmaster Algorithmist',
//       problem: 'Two Sum & Fast Hash Map Lookup',
//       requiredWins: 1,
//       tier: 'Grandmaster',
//       description: 'Minted for achieving optimal O(N) single-pass time complexity in 1v1 live combat.'
//     },
//     {
//       id: '2',
//       title: 'O(1) Space Memory Wizard',
//       problem: 'In-Place Singly Linked List Reversal',
//       requiredWins: 3,
//       tier: 'Diamond',
//       description: 'Minted for executing pointer reversal with strictly O(1) auxiliary memory overhead.'
//     },
//     {
//       id: '3',
//       title: 'Low-Level C Systems Slayer',
//       problem: 'Pointer Arithmetic & Dynamic Malloc',
//       requiredWins: 5,
//       tier: 'Platinum',
//       description: 'Mastery over raw memory management, double pointers, and boundary safety in C.'
//     },
//     {
//       id: '4',
//       title: 'Dynamic Programming Master',
//       problem: 'Kadane Maximum Subarray & Coin Change',
//       requiredWins: 10,
//       tier: 'Gold',
//       description: 'Optimal state transition formulation with dynamic programming table optimization.'
//     },
//   ];

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-10 space-y-6 text-left bg-[#0F1115] text-[#CBD5E1]">
      
//       {/* 1. Profile Top Card */}
//       <div className="bg-[#171A21] border border-[#2A2F38] rounded-xl p-5 sm:p-6 shadow-md">
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//           <div className="flex items-center space-x-3.5">
//             <div className="w-12 h-12 rounded-xl bg-[#0F1115] border border-[#2A2F38] flex items-center justify-center font-mono font-bold text-[#3B82F6] text-lg shrink-0">
//               {rawAddress.substring(2, 4).toUpperCase()}
//             </div>

//             <div className="space-y-0.5">
//               <div className="flex flex-wrap items-center gap-2">
//                 <h1 className="text-base sm:text-lg font-bold font-mono text-[#F1F5F9]">
//                   {rawAddress.substring(0, 8)}...{rawAddress.substring(rawAddress.length - 6)}
//                 </h1>
//                 <button
//                   onClick={copyAddress}
//                   className="p-1 rounded bg-[#0F1115] border border-[#2A2F38] hover:border-[#3B82F6] text-[#94A3B8] hover:text-[#F1F5F9] transition"
//                   title="Copy Wallet Address"
//                 >
//                   {copied ? <Check className="w-3 h-3 text-[#22C55E]" /> : <Copy className="w-3 h-3" />}
//                 </button>
//                 <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${currentTierInfo.badge} ${currentTierInfo.color}`}>
//                   <ShieldCheck className="w-3 h-3" />
//                   <span>{currentTierInfo.tier}</span>
//                 </span>
//               </div>

//               <div className="flex items-center space-x-2 text-xs text-[#94A3B8] font-mono">
//                 <span>Polygon Amoy Network</span>
//                 <span>•</span>
//                 <a
//                   href={`https://amoy.polygonscan.com/address/${rawAddress}`}
//                   target="_blank"
//                   rel="noreferrer"
//                   className="text-[#3B82F6] hover:underline flex items-center space-x-1"
//                 >
//                   <span>Polygonscan</span>
//                   <ExternalLink className="w-3 h-3" />
//                 </a>
//               </div>
//             </div>
//           </div>

//           <Link
//             href="/"
//             className="px-4 py-2 bg-[#3B82F6] hover:bg-[#60A5FA] text-white font-medium text-xs font-mono rounded-lg transition flex items-center space-x-1.5 shrink-0"
//           >
//             <Swords className="w-3.5 h-3.5" />
//             <span>Enter Battle</span>
//           </Link>
//         </div>

//         {/* Live On-Chain Stats Grid */}
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-[#2A2F38] font-mono">
//           <div className="bg-[#0F1115] p-3 rounded-lg border border-[#2A2F38]">
//             <p className="text-[11px] text-[#94A3B8]">Verified Wins</p>
//             <p className="text-lg font-bold text-[#22C55E] mt-0.5">{realWins} Wins</p>
//           </div>
//           <div className="bg-[#0F1115] p-3 rounded-lg border border-[#2A2F38]">
//             <p className="text-[11px] text-[#94A3B8]">Soulbound NFTs</p>
//             <p className="text-lg font-bold text-[#F59E0B] mt-0.5">{realBadgeCount} Badges</p>
//           </div>
//           <div className="bg-[#0F1115] p-3 rounded-lg border border-[#2A2F38]">
//             <p className="text-[11px] text-[#94A3B8]">POL Balance</p>
//             <p className="text-lg font-bold text-[#3B82F6] mt-0.5">{formattedBalance} POL</p>
//           </div>
//           <div className="bg-[#0F1115] p-3 rounded-lg border border-[#2A2F38]">
//             <p className="text-[11px] text-[#94A3B8]">Network</p>
//             <p className="text-sm font-semibold text-[#CBD5E1] mt-0.5">Polygon Amoy</p>
//           </div>
//         </div>
//       </div>

//       {/* 2. Soulbound NFT Badges Collection */}
//       <div className="space-y-3">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-2">
//             <Award className="w-4 h-4 text-[#3B82F6]" />
//             <h2 className="text-base font-bold text-[#F1F5F9] font-mono">
//               Soulbound Reputation Badges (ERC-721)
//             </h2>
//           </div>
//           <span className="text-xs font-mono text-[#94A3B8]">
//             {realBadgeCount > 0 ? `${realBadgeCount} Minted on Chain` : 'Badges Earned'}
//           </span>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
//           {allBadges.map((badge, idx) => {
//             const isUnlocked = realWins >= badge.requiredWins || realBadgeCount > idx;

//             return (
//               <div
//                 key={badge.id}
//                 className={`bg-[#171A21] border rounded-xl p-4 transition flex flex-col justify-between ${
//                   isUnlocked ? 'border-[#3B82F6]/40 shadow-sm' : 'border-[#2A2F38] opacity-50'
//                 }`}
//               >
//                 <div>
//                   <div className="flex items-center justify-between mb-2">
//                     <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0F1115] border border-[#2A2F38] text-[#94A3B8]">
//                       {badge.tier}
//                     </span>
//                     {isUnlocked ? (
//                       <Award className="w-4 h-4 text-[#3B82F6]" />
//                     ) : (
//                       <Lock className="w-3.5 h-3.5 text-[#94A3B8]" />
//                     )}
//                   </div>

//                   <h3 className="font-semibold text-[#F1F5F9] text-xs font-mono">{badge.title}</h3>
//                   <p className="text-[11px] text-[#94A3B8] mt-1 font-mono leading-relaxed">{badge.description}</p>
//                 </div>

//                 <div className="mt-3 pt-2 border-t border-[#2A2F38] flex items-center justify-between text-[10px] font-mono text-[#94A3B8]">
//                   <span className="flex items-center space-x-1">
//                     <Calendar className="w-3 h-3" />
//                     <span>Season 1</span>
//                   </span>
//                   <span className={isUnlocked ? 'text-[#3B82F6] font-semibold' : 'text-[#94A3B8]'}>
//                     {isUnlocked ? 'UNLOCKED' : `LOCKED (${badge.requiredWins}W)`}
//                   </span>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//     </div>
//   );
// }



"use client";

import { useParams } from 'next/navigation';
import { useAccount, useReadContract, useBalance } from 'wagmi';
import { 
  Award, 
  ShieldCheck, 
  ExternalLink, 
  Swords, 
  Copy, 
  Check, 
  Calendar, 
  Lock 
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { REPUTATION_NFT_ADDRESS, REPUTATION_NFT_ABI } from '@/config/contracts';

export default function ProfilePage() {
  const params = useParams();
  const rawAddress = (params.address as string) || '0x0000000000000000000000000000000000000000';
  const [copied, setCopied] = useState(false);

  const { data: onChainWinCount } = useReadContract({
    address: REPUTATION_NFT_ADDRESS,
    abi: REPUTATION_NFT_ABI,
    functionName: 'userWinCount',
    args: [rawAddress as `0x${string}`],
  });

  const { data: onChainNftBalance } = useReadContract({
    address: REPUTATION_NFT_ADDRESS,
    abi: REPUTATION_NFT_ABI,
    functionName: 'balanceOf',
    args: [rawAddress as `0x${string}`],
  });

  const { data: walletBalance } = useBalance({
    address: rawAddress as `0x${string}`,
  });

  const realWins = Number(onChainWinCount || 0);
  const realBadgeCount = Number(onChainNftBalance || 0);
  const formattedBalance = walletBalance ? parseFloat(walletBalance.formatted).toFixed(4) : '0.0000';

  const copyAddress = () => {
    navigator.clipboard.writeText(rawAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getDeveloperTier = (wins: number) => {
    if (wins >= 25) return { tier: 'Grandmaster S+', color: 'text-[#F59E0B]', badge: 'bg-[#F59E0B]/10 border-[#F59E0B]/30' };
    if (wins >= 10) return { tier: 'Master Tier', color: 'text-[#3B82F6]', badge: 'bg-[#3B82F6]/10 border-[#3B82F6]/30' };
    if (wins >= 3) return { tier: 'Diamond Tier', color: 'text-[#3B82F6]', badge: 'bg-[#3B82F6]/10 border-[#3B82F6]/30' };
    if (wins >= 1) return { tier: 'Gold Contender', color: 'text-[#22C55E]', badge: 'bg-[#22C55E]/10 border-[#22C55E]/30' };
    return { tier: 'Arena Initiate', color: 'text-[#94A3B8]', badge: 'bg-[#0F1115] border-[#2A2F38]' };
  };

  const currentTierInfo = getDeveloperTier(realWins);

  const allBadges = [
    {
      id: '1',
      title: 'Grandmaster Algorithmist',
      problem: 'Two Sum & Fast Hash Map Lookup',
      requiredWins: 1,
      tier: 'Grandmaster',
      description: 'Minted for achieving optimal O(N) single-pass time complexity in 1v1 live combat.'
    },
    {
      id: '2',
      title: 'O(1) Space Memory Wizard',
      problem: 'In-Place Singly Linked List Reversal',
      requiredWins: 3,
      tier: 'Diamond',
      description: 'Minted for executing pointer reversal with strictly O(1) auxiliary memory overhead.'
    },
    {
      id: '3',
      title: 'Low-Level C Systems Slayer',
      problem: 'Pointer Arithmetic & Dynamic Malloc',
      requiredWins: 5,
      tier: 'Platinum',
      description: 'Mastery over raw memory management, double pointers, and boundary safety in C.'
    },
    {
      id: '4',
      title: 'Dynamic Programming Master',
      problem: 'Kadane Maximum Subarray & Coin Change',
      requiredWins: 10,
      tier: 'Gold',
      description: 'Optimal state transition formulation with dynamic programming table optimization.'
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6 text-left bg-[#0F1115] text-[#CBD5E1]">
      
      {/* 1. Profile Top Card */}
      <div className="bg-[#171A21] border border-[#2A2F38] rounded-xl p-5 sm:p-6 shadow-sm transition-all duration-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#0F1115] border border-[#2A2F38] flex items-center justify-center font-mono font-bold text-[#3B82F6] text-lg shrink-0 transition-transform duration-200 hover:scale-105">
              {rawAddress.substring(2, 4).toUpperCase()}
            </div>

            <div className="space-y-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold font-mono text-[#F1F5F9]">
                  {rawAddress.substring(0, 8)}...{rawAddress.substring(rawAddress.length - 6)}
                </h1>
                <button
                  onClick={copyAddress}
                  className="p-1 rounded bg-[#0F1115] border border-[#2A2F38] hover:border-[#3B82F6] text-[#94A3B8] hover:text-[#F1F5F9] transition-all duration-150 active:scale-95"
                  title="Copy Wallet Address"
                >
                  {copied ? <Check className="w-3 h-3 text-[#22C55E]" /> : <Copy className="w-3 h-3" />}
                </button>
                <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${currentTierInfo.badge} ${currentTierInfo.color}`}>
                  <ShieldCheck className="w-3 h-3" />
                  <span>{currentTierInfo.tier}</span>
                </span>
              </div>

              <div className="flex items-center space-x-2 text-xs text-[#94A3B8] font-mono">
                <span>Polygon Amoy Network</span>
                <span>•</span>
                <a
                  href={`https://amoy.polygonscan.com/address/${rawAddress}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#3B82F6] hover:underline flex items-center space-x-1 transition-colors duration-150"
                >
                  <span>Polygonscan</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          <Link
            href="/"
            className="px-4 py-2 bg-[#3B82F6] hover:bg-[#60A5FA] text-white font-medium text-xs font-mono rounded-lg transition-all duration-150 ease-out hover:-translate-y-[1px] active:translate-y-[1px] active:scale-[0.98] shadow-sm flex items-center space-x-1.5 shrink-0"
          >
            <Swords className="w-3.5 h-3.5" />
            <span>Enter Battle</span>
          </Link>
        </div>

        {/* Live On-Chain Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-[#2A2F38] font-mono">
          <div className="bg-[#0F1115] p-3 rounded-lg border border-[#2A2F38] transition-all duration-150 hover:border-[#22C55E]/40">
            <p className="text-[11px] text-[#94A3B8]">Verified Wins</p>
            <p className="text-lg font-bold text-[#22C55E] mt-0.5">{realWins} Wins</p>
          </div>
          <div className="bg-[#0F1115] p-3 rounded-lg border border-[#2A2F38] transition-all duration-150 hover:border-[#F59E0B]/40">
            <p className="text-[11px] text-[#94A3B8]">Soulbound NFTs</p>
            <p className="text-lg font-bold text-[#F59E0B] mt-0.5">{realBadgeCount} Badges</p>
          </div>
          <div className="bg-[#0F1115] p-3 rounded-lg border border-[#2A2F38] transition-all duration-150 hover:border-[#3B82F6]/40">
            <p className="text-[11px] text-[#94A3B8]">POL Balance</p>
            <p className="text-lg font-bold text-[#3B82F6] mt-0.5">{formattedBalance} POL</p>
          </div>
          <div className="bg-[#0F1115] p-3 rounded-lg border border-[#2A2F38] transition-all duration-150 hover:border-[#2A2F38]/80">
            <p className="text-[11px] text-[#94A3B8]">Network</p>
            <p className="text-sm font-semibold text-[#CBD5E1] mt-0.5">Polygon Amoy</p>
          </div>
        </div>
      </div>

      {/* 2. Soulbound NFT Badges Collection (1-2px lift on hover) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-[#3B82F6]" />
            <h2 className="text-base font-bold text-[#F1F5F9] font-mono">
              Soulbound Reputation Badges (ERC-721)
            </h2>
          </div>
          <span className="text-xs font-mono text-[#94A3B8]">
            {realBadgeCount > 0 ? `${realBadgeCount} Minted on Chain` : 'Badges Earned'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {allBadges.map((badge, idx) => {
            const isUnlocked = realWins >= badge.requiredWins || realBadgeCount > idx;

            return (
              <div
                key={badge.id}
                className={`bg-[#171A21] border rounded-xl p-4 transition-all duration-200 ease-out flex flex-col justify-between ${
                  isUnlocked ? 'border-[#3B82F6]/40 hover:-translate-y-[2px] hover:border-[#3B82F6] shadow-sm' : 'border-[#2A2F38] opacity-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0F1115] border border-[#2A2F38] text-[#94A3B8]">
                      {badge.tier}
                    </span>
                    {isUnlocked ? (
                      <Award className="w-4 h-4 text-[#3B82F6]" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-[#94A3B8]" />
                    )}
                  </div>

                  <h3 className="font-semibold text-[#F1F5F9] text-xs font-mono">{badge.title}</h3>
                  <p className="text-[11px] text-[#94A3B8] mt-1 font-mono leading-relaxed">{badge.description}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-[#2A2F38] flex items-center justify-between text-[10px] font-mono text-[#94A3B8]">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>Season 1</span>
                  </span>
                  <span className={isUnlocked ? 'text-[#3B82F6] font-semibold' : 'text-[#94A3B8]'}>
                    {isUnlocked ? 'UNLOCKED' : `LOCKED (${badge.requiredWins}W)`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}