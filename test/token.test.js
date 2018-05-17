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
      var tokenBalance;
      // mint 100k token to each of the first 60 accounts
      for (var i = 1; i <= 60; i++) {
        await token.ownerMint(accounts[i], ether(100000));
        tokenBalance = await token.balanceOf(accounts[i]);
        assert.equal(tokenBalance.toNumber(), ether(100000).toNumber());
      }
    });

    it("attempt to mint while over total owner mint limit should fail", async () => {
      // mint 100k token to each of the first 60 accounts
      for (var i = 1; i <= 60; i++) {
        await token.ownerMint(accounts[i], ether(100000));
      }
      console.log(await token.totalOwnerMinted());
      // try to mint 1 more wei to account 61
      await assertRevert(token.ownerMint(accounts[61], 1));
    });

    it("attempt to mint while over per-user owner mint limit should fail", async () => {});
  });

  describe("user minting", function() {
    beforeEach(async () => {
      token = await TestToken.new();
    });

    it("attempt to mint while under user mint limits should succeed", async () => {});

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
