import { ethers, upgrades } from "hardhat";

const PROXY = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

async function main() {
  const Contract2 = await ethers.getContractFactory("Contract2");
  console.log("Upgrating Contract1...");
  await upgrades.upgradeProxy(PROXY, Contract2);
  console.log("Contract1 upgraded");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
