const {expect} = require("chai");
const {ethers, upgrades} = require("hardhat");

describe("PseudoERC20", function () {
    it("Should fix vulnerability using proxy", async function () {

        const [, hacker1, hacker2, hacker3, hacker4] = await ethers.getSigners();

        const PseudoERC20V1 = await ethers.getContractFactory("PseudoERC20V1");
        const pseudoERC20V1 = await upgrades.deployProxy(PseudoERC20V1);
        await pseudoERC20V1.deployed();

        await tryHack(pseudoERC20V1, hacker1, hacker2);

        const PseudoERC20V2 = await ethers.getContractFactory("PseudoERC20V2");
        const pseudoERC20V2 = await upgrades.upgradeProxy(pseudoERC20V1.address, PseudoERC20V2);
        await pseudoERC20V2.deployed();

        await expect(tryHack(pseudoERC20V1, hacker3, hacker4)).to.be.revertedWith("PseudoERC20: transfer amount exceeds balance'")
    });

    async function tryHack(pseudoERC20, hacker1, hacker2) {
        const hacker1BalanceBefore = await pseudoERC20.connect(hacker1).balanceOf(hacker1.address);
        const hacker2BalanceBefore = await pseudoERC20.connect(hacker2).balanceOf(hacker2.address);

        expect(hacker1BalanceBefore).to.equal(0);
        expect(hacker2BalanceBefore).to.equal(0);

        let hackedTokenAmount = ethers.utils.parseUnits("100", 18);
        await pseudoERC20.connect(hacker2).transfer(hacker1.address, hackedTokenAmount)

        const hacker1BalanceAfter = await pseudoERC20.connect(hacker1).balanceOf(hacker1.address);
        const hacker2BalanceAfter = await pseudoERC20.connect(hacker2).balanceOf(hacker2.address);

        expect(hacker1BalanceAfter).to.equal(hackedTokenAmount);
        expect(hacker2BalanceAfter).to.equal(0);
    }
});
