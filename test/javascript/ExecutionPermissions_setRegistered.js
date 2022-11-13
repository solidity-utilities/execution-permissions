"use strict";

const ExecutionPermissions = artifacts.require("ExecutionPermissions");

const ExampleUsage = artifacts.require("ExampleUsage");
const NotOwnable = artifacts.require("NotOwnable");

const {
  revertToSnapShot,
  takeSnapShot,
} = require("./lib/web3-ganache-helpers.js");

//
contract("ExecutionPermissions.setRegistered -- Success", (accounts) => {
  const owner = accounts[0];

  const contracts = {
    ExecutionPermissions: undefined,
    ExampleUsage: undefined,
    NotOwnable: undefined,
  };

  let snapshot_id;

  //
  beforeEach(async () => {
    snapshot_id = (await takeSnapShot()).result;

    contracts.ExecutionPermissions = await ExecutionPermissions.deployed();

    contracts.ExampleUsage = await ExampleUsage.new(
      contracts.ExecutionPermissions.address,
      { from: owner }
    );
  });

  //
  afterEach(async () => {
    await revertToSnapShot(snapshot_id);
  });

  //
  it("`setRegistered(address,bool)` -- Allows mutation of registered state from `ExampleUsage` owner", async () => {
    const ref = contracts.ExampleUsage.address;

    {
      const state = true;

      await contracts.ExecutionPermissions.methods[
        "setRegistered(address,bool)"
      ](ref, state, { from: owner });

      const response = await contracts.ExecutionPermissions.registered(ref);

      return assert.equal(response, state, "Failed to register");
    }

    {
      const state = false;

      await contracts.ExecutionPermissions.methods[
        "setRegistered(address,bool)"
      ](ref, state, { from: owner });

      const response = await contracts.ExecutionPermissions.registered(ref);

      return assert.equal(response, state, "Failed to unregister");
    }
  });

  //
  it("`setRegistered(bool)` -- Allows mutation from contract instance", async () => {
    const ref = contracts.ExampleUsage.address;

    {
      const state = true;

      await contracts.ExampleUsage.methods["setRegistered(bool)"](state, {
        from: owner,
      });

      const response = await contracts.ExecutionPermissions.registered(ref);

      return assert.equal(response, state, "Failed to register");
    }

    {
      const state = false;

      await contracts.ExampleUsage.methods["setRegistered(bool)"](state, {
        from: owner,
      });

      const response = await contracts.ExecutionPermissions.registered(ref);

      return assert.equal(response, state, "Failed to unregister");
    }
  });
});

//
contract("ExecutionPermissions.setRegistered -- Error", (accounts) => {
  const owner = accounts[0];

  const contracts = {
    ExecutionPermissions: undefined,
    ExampleUsage: undefined,
    NotOwnable: undefined,
  };

  let snapshot_id;

  //
  beforeEach(async () => {
    snapshot_id = (await takeSnapShot()).result;

    contracts.ExecutionPermissions = await ExecutionPermissions.deployed();

    contracts.ExampleUsage = await ExampleUsage.new(
      contracts.ExecutionPermissions.address,
      { from: owner }
    );

    contracts.NotOwnable = await NotOwnable.new({ from: owner });
  });

  //
  afterEach(async () => {
    await revertToSnapShot(snapshot_id);
  });

  //
  it("`setRegistered(bool)` -- Rejects non-contract addresses", async () => {
    const expected = "ExecutionPermissions: instance not initialized";

    let caught_error;
    try {
      await contracts.ExecutionPermissions.methods["setRegistered(bool)"](
        true,
        { from: owner }
      );
    } catch (revert) {
      if (revert.reason !== expected) {
        console.error(revert);
      }
      assert.equal(
        revert.reason,
        expected,
        "Failed to catch expected `revert.reason`"
      );
      caught_error = true;
    }

    assert.equal(caught_error, true, "Failed to catch any error");
  });

  //
  it("`setRegistered(address,bool)` -- Rejects non-contract addresses", async () => {
    const expected = "ExecutionPermissions: instance not initialized";

    let caught_error;
    try {
      await contracts.ExecutionPermissions.methods[
        "setRegistered(address,bool)"
      ](accounts[0], true, { from: owner });
    } catch (revert) {
      if (revert.reason !== expected) {
        console.error(revert);
      }
      assert.equal(
        revert.reason,
        expected,
        "Failed to catch expected `revert.reason`"
      );
      caught_error = true;
    }

    assert.equal(caught_error, true, "Failed to catch any error");
  });

  //
  it("`setRegistered(address,bool)` -- Rejects non-ownable contracts", async () => {
    const expected =
      "ExecutionPermissions: instance does not implement `.owner()`";

    let caught_error;
    try {
      await contracts.ExecutionPermissions.methods[
        "setRegistered(address,bool)"
      ](contracts.NotOwnable.address, true, { from: owner });
    } catch (revert) {
      if (revert.reason !== expected) {
        console.error(revert);
      }
      assert.equal(
        revert.reason,
        expected,
        "Failed to catch expected `revert.reason`"
      );
      caught_error = true;
    }

    assert.equal(caught_error, true, "Failed to catch any error");
  });

  //
  it("`setRegistered(address,bool)` -- Rejects non-owner of referenced contract", async () => {
    const expected = "ExecutionPermissions: not instance owner";

    let caught_error;
    try {
      await contracts.ExecutionPermissions.methods[
        "setRegistered(address,bool)"
      ](contracts.ExampleUsage.address, true, { from: accounts[1] });
    } catch (revert) {
      if (revert.reason !== expected) {
        console.error(revert);
      }
      assert.equal(
        revert.reason,
        expected,
        "Failed to catch expected `revert.reason`"
      );
      caught_error = true;
    }

    assert.equal(caught_error, true, "Failed to catch any error");
  });
});
