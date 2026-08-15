const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log(`🚀 Deploying with account: ${deployer.address}`);

  // 👇 PASTE YOUR REPUTATION NFT ADDRESS HERE:
  const nftAddress = "0xB12a4C4472415AEF879aDa91Ff67627f69b136cB";

  console.log(`♻️  Using existing ReputationNFT at: ${nftAddress}`);
  const reputationNFT = await hre.ethers.getContractAt("ReputationNFT", nftAddress);

  // 2. Deploy BattleArena (Only costs ~0.03 POL, you have 0.062 POL!)
  console.log(`⏳ Deploying BattleArena...`);
  const BattleArena = await hre.ethers.getContractFactory("BattleArena");
  const battleArena = await BattleArena.deploy(deployer.address);
  await battleArena.waitForDeployment();
  const arenaAddress = await battleArena.getAddress();
  console.log(`✅ BattleArena deployed to: ${arenaAddress}`);

  // 3. Link them together
  console.log(`🔗 Linking contracts...`);
  const tx1 = await reputationNFT.setBattleArenaContract(arenaAddress);
  await tx1.wait();
  const tx2 = await battleArena.setReputationNFT(nftAddress);
  await tx2.wait();
  console.log(`🎉 All contracts deployed and linked successfully!`);

  console.log("\n================ COPY TO FRONTEND ================");
  console.log(`NEXT_PUBLIC_BATTLE_ARENA_ADDRESS="${arenaAddress}"`);
  console.log(`NEXT_PUBLIC_REPUTATION_NFT_ADDRESS="${nftAddress}"`);
  console.log("===================================================\n");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});