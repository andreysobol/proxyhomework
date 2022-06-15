const {ethers, upgrades} = require("hardhat");

async function main() {
    const PseudoERC20V1 = await ethers.getContractFactory("PseudoERC20V1");
    const pseudoERC20V1 = await upgrades.deployProxy(PseudoERC20V1);
    await pseudoERC20V1.deployed();
    console.log("PseudoERC20V1 deployed to:", pseudoERC20V1.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
