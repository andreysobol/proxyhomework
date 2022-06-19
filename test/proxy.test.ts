import { expect } from "chai";
import { utils } from "ethers";
import { Contract1 } from "../typechain";
const { ethers, upgrades } = require("hardhat");

describe("Proxy", function () {

  it("should be possible to hacked the v1 contract", async function () {
    const [owner, hacker] = await ethers.getSigners();

    const Contract1 = await ethers.getContractFactory("Contract1");
    console.log("Deploying Contract1...");
    const contract = await upgrades.deployProxy(Contract1);
    await contract.deployed();

    const exploit = await deployExploit(contract.address);

    await contract.connect(owner).deposit({ value: utils.parseEther("4.0") });
    await exploit.connect(hacker).attack({ value: utils.parseEther("1.0") });

    console.log("Attacked contract balance:", await contract.balance());
    console.log("Attacker contract balance:", await exploit.balance());

    expect(await contract.balance()).to.equal(0);
  });

  it("should not be possible to hacked the v2 contract", async function () {
    const [owner, hacker] = await ethers.getSigners();

    const Contract1 = await ethers.getContractFactory("Contract1");
    const contract = await upgrades.deployProxy(Contract1);
    await contract.deployed();

    const Contract2 = await ethers.getContractFactory("Contract2");
    await upgrades.upgradeProxy(contract.address, Contract2);
  
    const exploit = await deployExploit(contract.address);

    await contract.connect(owner).deposit({ value: utils.parseEther("4.0") });

    console.log("Attacked contract balance:", await contract.balance());
    console.log("Attacker contract balance:", await exploit.balance());

    await expect(
      exploit.connect(hacker).attack({ value: utils.parseEther("1.0") })
    ).to.be.revertedWith("callWithdrawBalance unsuccess");
  });

  async function deployExploit(address: String) {
    const [, hacker] = await ethers.getSigners();

    const Attack = await ethers.getContractFactory("Attack");
    const exploit = await Attack.connect(hacker).deploy(address);
    await exploit.deployed();

    return exploit;
  }
});
