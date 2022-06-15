const {ethers, upgrades} = require("hardhat");

const PROXY_ADDRESS = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";

async function main() {
    const PseudoERC20V2 = await ethers.getContractFactory("PseudoERC20V2");
    const pseudoERC20V2 = await upgrades.upgradeProxy(PROXY_ADDRESS, PseudoERC20V2);
    await pseudoERC20V2.deployed();
    console.log("PseudoERC20 upgraded");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
