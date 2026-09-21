const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const balance = await hre.ethers.provider.getBalance(deployer.address);

  console.log(`🚀 Deploying with account: ${deployer.address}`);
  console.log(`💰 Remaining Balance: ${hre.ethers.formatEther(balance)} POL`);

  // 1. REUSE the freshly deployed ReputationNFT (already has public claimBadge!)
  const nftAddress = "0x82758c7962344A06177153586717375d62956277";
  console.log(`♻️  Using updated ReputationNFT at: ${nftAddress}`);
  const reputationNFT = await hre.ethers.getContractAt("ReputationNFT", nftAddress);

  // Explicit gas limit to prevent "out of gas"
  const gasOverrides = {
    gasPrice: hre.ethers.parseUnits("25", "gwei"),
    gasLimit: 1400000,
  };

  // 2. Deploy BattleArena (Only costs ~0.02 POL)
  console.log("⏳ Deploying BattleArena...");
  const BattleArena = await hre.ethers.getContractFactory("BattleArena");
  const battleArena = await BattleArena.deploy(deployer.address, gasOverrides);
  await battleArena.waitForDeployment();
  const arenaAddress = await battleArena.getAddress();
  console.log(`✅ BattleArena deployed to: ${arenaAddress}`);

  // 3. Link them together
  console.log("🔗 Linking contracts...");
  const tx1 = await reputationNFT.setBattleArenaContract(arenaAddress, {
    gasPrice: hre.ethers.parseUnits("25", "gwei"),
    gasLimit: 100000,
  });
  await tx1.wait();

  const tx2 = await battleArena.setReputationNFT(nftAddress, {
    gasPrice: hre.ethers.parseUnits("25", "gwei"),
    gasLimit: 100000,
  });
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