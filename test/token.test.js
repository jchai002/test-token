import ether from "./helpers/ether";
import assertRevert from "./helpers/assertRevert";

const BigNumber = web3.BigNumber;
const TestToken = artifacts.require("./TestToken.sol");

// note: testrpc should have at least 600 accounts (exclude owner) for the user mint tests
contract("Contract: TestToken", accounts => {
  var token;
  const ownerMintLimit = ether(100000);
  const selfMintLimit = ether(10000);

  describe("owner minting", function() {
    beforeEach(async () => {
      token = await TestToken.new();
    });

    it("attempt to mint while under owner mint limits should succeed", async () => {
      var tokenBalance;
      // mint 100k token to each of the first 60 accounts
      for (var i = 1; i <= 60; i++) {
        await token.ownerMint(accounts[i], ownerMintLimit);
        tokenBalance = await token.balanceOf(accounts[i]);
        expect(tokenBalance).to.deep.equal(ownerMintLimit);
      }
    });

    it("attempt to mint while over total owner mint limit should fail", async () => {
      // mint 100k token to each of the first 60 accounts
      for (var i = 1; i <= 60; i++) {
        await token.ownerMint(accounts[i], ownerMintLimit);
      }
      // try to mint 1 more wei to account 0
      await assertRevert(token.ownerMint(accounts[0], 1));
    });

    it("attempt to mint while over per-user owner mint limit should fail", async () => {
      // first mint to 100k limit
      await token.ownerMint(accounts[1], ownerMintLimit);
      // then try to mint 1 more wei
      await assertRevert(token.ownerMint(accounts[1], 1));
    });
  });

  describe("user minting", function() {
    beforeEach(async () => {
      token = await TestToken.new();
      // mint 6mil tokens from owner
      for (var i = 1; i <= 60; i++) {
        await token.ownerMint(accounts[i], ownerMintLimit);
      }
    });

    it("attempt to mint while under user mint limits should succeed", async () => {
      var tokenBalance;
      // mint 10k token to each of the first 600 accounts
      for (var i = 1; i <= 600; i++) {
        await token.selfMint(selfMintLimit, { from: accounts[i] });
        tokenBalance = await token.balanceOf(accounts[i]);
        if (i <= 60) {
          // the first 60 accounts should have 110k tokens
          expect(tokenBalance).to.deep.equal(ether(110000));
        } else {
          // the test should have 10k tokens
          expect(tokenBalance).to.deep.equal(selfMintLimit);
        }
      }
    });

    it("attempt to mint while over total user mint limit should fail", async () => {
      // mint 10k token to each of the first 600 accounts
      for (var i = 1; i <= 600; i++) {
        await token.selfMint(selfMintLimit, { from: accounts[i] });
      }
      await assertRevert(token.selfMint(1, { from: accounts[0] }));
    });

    it("attempt to mint while over per-user user mint limit should fail", async () => {
      await token.selfMint(selfMintLimit, { from: accounts[0] });
      await assertRevert(token.selfMint(1, { from: accounts[0] }));
    });
  });

  describe("transfer", function() {
    beforeEach(async () => {
      token = await TestToken.new();
    });

    it("transfer should fail before all minting complete", async () => {
      await token.ownerMint(accounts[1], ownerMintLimit);
      await assertRevert(token.transfer(accounts[2], 1, { from: accounts[1] }));
    });

    it("transfer should succeed after all minting complete", async () => {
      // mint 100k token to each of the first 60 accounts
      for (var i = 1; i <= 60; i++) {
        await token.ownerMint(accounts[i], ownerMintLimit);
      }
      // mint 10k token to each of the first 600 accounts
      for (var i = 1; i <= 600; i++) {
        await token.selfMint(selfMintLimit, { from: accounts[i] });
      }
      var account2balanceBefore = await token.balanceOf(accounts[2]);
      await token.transfer(accounts[2], 1, { from: accounts[1] });
      var account2balanceAfter = await token.balanceOf(accounts[2]);
      expect(account2balanceBefore.plus(1)).to.deep.equal(account2balanceAfter);
    });
  });
});
