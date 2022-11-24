"use strict";

const ExecutionPermissions = artifacts.require("ExecutionPermissions");

const {
  revertToSnapShot,
  takeSnapShot,
} = require("./lib/web3-ganache-helpers.js");

//
contract("ExecutionPermissions.constructor", (accounts) => {
  const owner = accounts[0];
  const contracts = {};

  let snapshot_id;

  //
  beforeEach(async () => {
    snapshot_id = (await takeSnapShot()).result;
    contracts.ExecutionPermissions = await ExecutionPermissions.deployed();
  });

  //
  afterEach(async () => {
    await revertToSnapShot(snapshot_id);
  });

  it("Gets expected owner", async () => {
    const response = await contracts.ExecutionPermissions.owner();
    return assert.equal(response, owner, "Failed to get expected owner");
  });
});
