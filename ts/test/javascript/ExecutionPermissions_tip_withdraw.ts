"use strict";

const ExecutionPermissions = artifacts.require("ExecutionPermissions");

const {
  revertToSnapShot,
  takeSnapShot,
} = require("./lib/web3-ganache-helpers.js");

/**
 * @callback Described_Tests
 * @param {string[]} accounts
 */

/**
 * @typedef Contract_Base
 * @type {Object}
 * @property {string} address - Public key of published contract
 */

/**
 * Wrapper for interacting with contract instance
 * @typedef ExecutionPermissions
 * @type {Contract_Base}
 */

/**
 * @typedef Contracts
 * @property {ExecutionPermissions} ExecutionPermissions
 */

/**
 * @function Described_Contract
 * @param {string} title
 * @param {Described_Tests} tests
 */
contract(
  "ExecutionPermissions.tip and ExecutionPermissions.withdraw",

  /**
   * @type Described_Tests
   */
  (accounts) => {
    const owner = accounts[0];
    const tipper = accounts[1];
    const recipient = accounts[2];
    const bad_actor = accounts.at(-1);

    /**
     * @type Contracts
     */
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

    //
    it("`.tip` -- Allowed from anyone", async () => {
      const balances = {
        contract: {
          before: NaN,
          after: NaN,
        },
      };

      balances.contract.before = await web3.eth.getBalance(
        contracts.ExecutionPermissions.address
      );

      const tx_options = {
        from: tipper,
        value: web3.utils.toWei("0.01", "ether"),
      };

      await contracts.ExecutionPermissions.tip(tx_options);

      balances.contract.after = await web3.eth.getBalance(
        contracts.ExecutionPermissions.address
      );

      assert.equal(balances.contract.after, tx_options.value, "Failed to tip");
    });

    //
    it("`.withdraw(to,amount)` -- Allowed from owner", async () => {
      const balances = {
        contract: {
          before: NaN,
          after: NaN,
        },
        recipient: {
          before: NaN,
          after: NaN,
        },
      };

      const value = web3.utils.toWei("0.01", "ether");

      //
      {
        balances.contract.before = await web3.eth.getBalance(
          contracts.ExecutionPermissions.address
        );

        const tx_options = {
          from: tipper,
          value,
        };

        await contracts.ExecutionPermissions.tip(tx_options);

        balances.contract.after = await web3.eth.getBalance(
          contracts.ExecutionPermissions.address
        );

        assert.equal(
          balances.contract.after,
          tx_options.value,
          "Failed to tip"
        );
      }

      //
      {
        balances.recipient.before = await web3.eth.getBalance(recipient);

        balances.contract.before = await web3.eth.getBalance(
          contracts.ExecutionPermissions.address
        );

        const parameters = {
          to: recipient,
          amount: value,
        };

        const tx_options = { from: owner };
        await contracts.ExecutionPermissions.withdraw(
          ...Object.values(parameters),
          tx_options
        );

        balances.recipient.after = await web3.eth.getBalance(recipient);

        balances.contract.after = await web3.eth.getBalance(
          contracts.ExecutionPermissions.address
        );

        assert.notEqual(
          balances.contract.before,
          balances.contract.after,
          "Failed to reduce contract balance"
        );

        // assert.notEqual(
        //   balances.recipient.before,
        //   balances.recipient.after,
        //   "Failed to increase recipient balance"
        // );
      }
    });

    //
    it("`.withdraw(to,amount)` -- Rejects non-contract owner", async () => {
      const expected = "ExecutionPermissions: caller not owner";

      let caught_error;
      try {
        const parameters = {
          to: recipient,
          amount: '1',
        };

        const tx_options = { from: bad_actor };

        await contracts.ExecutionPermissions.withdraw(
          ...Object.values(parameters),
          tx_options
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
  }
);
