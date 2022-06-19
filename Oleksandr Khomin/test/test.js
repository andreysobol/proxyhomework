const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token contract", function () {

  let TokenV1;
  let TokenV2;
  let tokenV1;
  let tokenV2;
  let Proxy;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async () => {
    Proxy = await ethers.getContractFactory("Proxy");
    TokenV1 = await ethers.getContractFactory("TokenV1");
    TokenV2 = await ethers.getContractFactory("TokenV2");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    tokenV1 = await TokenV1.deploy();
    tokenV2 = await TokenV2.deploy();
    // proxyV1 = TokenV1.attach(proxy1.address);
    // proxyV2 = TokenV2.attach(proxy2.address);
  });

  describe("Deployment", function () {
    it("should assign total supply to owner", async function () {
      const ownerBalance = await tokenV1.balanceOf(owner.address);
      expect(await tokenV1.totalSupply()).to.eq(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("should transfer tokens between accounts", async function () {
      await tokenV1.transfer(addr1.address, 50);
      const addr1Balance = await tokenV1.balanceOf(addr1.address);
      expect(addr1Balance).to.eq(50);

      await tokenV1.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await tokenV1.balanceOf(addr2.address);
      expect(addr2Balance).to.eq(50);
    });

    // it("should fail if sender doesn't have enough tokens", async function () {
    //   const initialOwnerBalance = await tokenV1.balanceOf(owner.address);
    //
    //   await expect(tokenV1.connect(addr1).transfer(owner.address, 1)).to.be.reverted;
    //
    //   expect(await tokenV1.balanceOf(owner.address)).to.eq(initialOwnerBalance);
    // });

    it("should update balances after transfers", async function () {
      const initialOwnerBalance = await tokenV1.balanceOf(owner.address);

      await tokenV1.transfer(addr1.address, 50);

      await tokenV1.transfer(addr2.address, 50);

      const finalOwnerBalance = await tokenV1.balanceOf(owner.address);
      expect(finalOwnerBalance).to.eq(initialOwnerBalance.sub(100));

      const addr1Balance = await tokenV1.balanceOf(addr1.address);
      expect(addr1Balance).to.eq(50);

      const addr2Balance = await tokenV1.balanceOf(addr2.address);
      expect(addr2Balance).to.eq(50);
    });

    it("should hack the contract", async function () {
      await tokenV1.transfer(addr1.address, await tokenV1.totalSupply() + 1);

      const finalOwnerBalance = await tokenV1.balanceOf(owner.address);
      expect(finalOwnerBalance).to.lt(0);
    });

  });

  describe("TokenV2", function () {
    it("should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await tokenV2.balanceOf(owner.address);

      await expect(tokenV2.connect(addr1).transfer(owner.address, 1)).to.be.reverted;

      expect(await tokenV2.balanceOf(owner.address)).to.eq(initialOwnerBalance);
    });
  });

  describe("Proxy", function () {
    it("should assign total supply to owner", async function () {
      const proxyV1 = await Proxy.deploy(tokenV1.address);
      const proxy = await TokenV1.attach(proxyV1.address);
      const ownerBalance = await proxy.balanceOf(owner.address);
      expect(await proxy.totalSupply()).to.eq(ownerBalance);
    });

    it("should hack the contract", async function () {
      const proxyV1 = await Proxy.deploy(tokenV1.address);
      const proxy = await TokenV1.attach(proxyV1.address);

      await proxy.transfer(addr1.address, await proxy.totalSupply() + 1);
      expect(await proxy.balanceOf(owner.address)).to.lt(0);
    });

    it("should upgrade the contract and fix the bug", async function () {
      const proxyV1 = await Proxy.deploy(tokenV1.address);
      await proxyV1.setImplementation(tokenV2.address);

      const proxy = await TokenV2.attach(proxyV1.address);

      await expect(proxy.transfer(addr1.address, await proxy.totalSupply() + 1)).to.be.reverted;
    });
  });
});
