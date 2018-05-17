import ether from "./helpers/ether";
import assertRevert from "./helpers/assertRevert";

const BigNumber = web3.BigNumber;
const TestToken = artifacts.require("./TestToken.sol");

// note: testrpc should have at least 600 accounts (exclude owner) for the user mint tests
contract("Contract: TestToken", accounts => {
  const owner = accounts[0];
  var token;

  describe("owner minting", function() {
    beforeEach(async () => {
      token = await TestToken.new();
    });

    it("attempt to mint while under owner mint limits should succeed", async () => {
      // var tokenBalance;
      // // mint 100k token to each of the first 60 accounts
      // for (var i = 1; i <= 60; i++) {
      //   await token.ownerMint(accounts[i], ether(100000));
      //   tokenBalance = await token.balanceOf(accounts[i]);
      //   assert.equal(tokenBalance.toNumber(), ether(100000).toNumber());
      // }
    });

    it("attempt to mint while over total owner mint limit should fail", async () => {
      // // mint 100k token to each of the first 60 accounts
      // for (var i = 1; i <= 60; i++) {
      //   await token.ownerMint(accounts[i], ether(100000));
      // }
      // // try to mint 1 more wei to account 61
      // await assertRevert(token.ownerMint(accounts[61], 1));
    });

    it("attempt to mint while over per-user owner mint limit should fail", async () => {
      // // first mint to 100k limit
      // await token.ownerMint(accounts[1], ether(100000));
      // // then try to mint 1 more wei
      // await assertRevert(token.ownerMint(accounts[1], 1));
    });
  });

  describe("user minting", function() {
    beforeEach(async () => {
      token = await TestToken.new();
      // mint 6mil tokens from owner
      for (var i = 1; i <= 60; i++) {
        await token.ownerMint(accounts[i], ether(100000));
      }
    });

    it("attempt to mint while under user mint limits should succeed", async () => {
      var tokenBalance;
      // mint 10k token to each of the first 600 accounts
      for (var i = 1; i <= 600; i++) {
        await token.selfMint(ether(10000), { from: accounts[i] });
        tokenBalance = await token.balanceOf(accounts[i]);
        if (i <= 60) {
          // the first 60 accounts should have 110k tokens
          assert.equal(tokenBalance.toNumber(), ether(110000).toNumber());
        } else {
          // the test should have 10k tokens
          assert.equal(tokenBalance.toNumber(), ether(10000).toNumber());
        }
      }
    });

    it("attempt to mint while over total user mint limit should fail", async () => {});

    it("attempt to mint while over per-user user mint limit should fail", async () => {});
  });

  describe("transfer", function() {
    beforeEach(async () => {
      token = await TestToken.new();
    });

    it("transfer should fail before all minting complete", async () => {});

    it("transfer should succeed after all minting complete", async () => {});
  });
});
