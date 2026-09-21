const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const balance = await hre.ethers.provider.getBalance(deployer.address);

  console.log(`🚀 Deploying with account: ${deployer.address}`);
  console.log(`💰 Account Balance: ${hre.ethers.formatEther(balance)} POL`);

  // Fetch network fee data to prevent gas spikes
  const feeData = await hre.ethers.provider.getFeeData();
  const gasOverrides = {
    gasPrice: feeData.gasPrice || hre.ethers.parseUnits("35", "gwei"),
  };

  // 1. Deploy the NEW ReputationNFT (with public claimBadge function)
  console.log("⏳ Deploying updated ReputationNFT (with public claimBadge)...");
  const ReputationNFT = await hre.ethers.getContractFactory("ReputationNFT");
  const reputationNFT = await ReputationNFT.deploy(gasOverrides);
  await reputationNFT.waitForDeployment();
  const nftAddress = await reputationNFT.getAddress();
  console.log(`✅ New ReputationNFT deployed to: ${nftAddress}`);

  // 2. Deploy BattleArena
  console.log("⏳ Deploying BattleArena...");
  const BattleArena = await hre.ethers.getContractFactory("BattleArena");
  const battleArena = await BattleArena.deploy(deployer.address, gasOverrides);
  await battleArena.waitForDeployment();
  const arenaAddress = await battleArena.getAddress();
  console.log(`✅ BattleArena deployed to: ${arenaAddress}`);

  // 3. Link them together
  console.log("🔗 Linking contracts...");
  const tx1 = await reputationNFT.setBattleArenaContract(arenaAddress, gasOverrides);
  await tx1.wait();
  const tx2 = await battleArena.setReputationNFT(nftAddress, gasOverrides);
  await tx2.wait();
  console.log("🎉 All contracts deployed and linked successfully!");

  console.log("\n================ COPY TO FRONTEND ================");
  console.log(`NEXT_PUBLIC_BATTLE_ARENA_ADDRESS="${arenaAddress}"`);
  console.log(`NEXT_PUBLIC_REPUTATION_NFT_ADDRESS="${nftAddress}"`);
  console.log("===================================================\n");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});