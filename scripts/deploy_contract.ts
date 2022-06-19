import { ethers, upgrades } from "hardhat";

async function main() {
  const Contract1 = await ethers.getContractFactory("Contract1");
  console.log("Deploying Contract1...");
  const contract = await upgrades.deployProxy(Contract1);
  await contract.deployed();

  console.log("Contract1 deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
