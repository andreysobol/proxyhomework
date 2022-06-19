
const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contract with the account: ", deployer.address);

    console.log("Account balance: ", (await deployer.getBalance()).toString());

    const TokenV1 = await ethers.getContractFactory("TokenV1");
    const TokenV2 = await ethers.getContractFactory("TokenV2");
    const Proxy = await ethers.getContractFactory("Proxy");

    // deploy first copy of the contract
    const token = await TokenV1.deploy();
    console.log("Token address: ", token.address);

    // deploy second copy of the contract
    const token2 = await TokenV2.deploy();
    console.log("Token2 address: ", token2.address);

    const proxy = await Proxy.deploy(token.address);
    console.log("Proxy address: ", proxy.address);
    console.log("Proxy implementation: ", (await proxy.implementation()).toString());

    await proxy.setImplementation(token2.address);
    console.log("Proxy implementation: ", (await proxy.implementation()).toString());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
