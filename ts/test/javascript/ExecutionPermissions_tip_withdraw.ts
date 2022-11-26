// vim: noexpandtab
'use strict';

const ExecutionPermissions = artifacts.require('ExecutionPermissions');

import { revertToSnapShot, takeSnapShot } from './lib/web3-ganache-helpers';

import { JsonRpcResponse } from 'web3-core-helpers';

import { Extended_Types } from '../../../@types/index';
import { IExecutionPermissionsInstance } from '../../../@types/truffle-v5/';

//
contract('ExecutionPermissions.{tip,withdraw} -- Success', (accounts) => {
	const owner = accounts[0];
	const tipper = accounts[1];
	const recipient = accounts[2];

	const contracts = {} as {
		ExecutionPermissions: IExecutionPermissionsInstance;
	};

	let snapshot_id: JsonRpcResponse['id'];

	//
	beforeEach(async () => {
		snapshot_id = ((await takeSnapShot()) as JsonRpcResponse).result;
		contracts.ExecutionPermissions = await ExecutionPermissions.deployed();
	});

	//
	afterEach(async () => {
		await revertToSnapShot(snapshot_id);
	});

	//
	it('`.tip` -- Allowed from anyone', async () => {
		const balances = {
			contract: {
				before: NaN,
				after: NaN,
			},
		} as {
			contract: {
				before: number | string;
				after: number | string;
			};
		};

		balances.contract.before = await web3.eth.getBalance(contracts.ExecutionPermissions.address);

		const tx_options = {
			from: tipper,
			value: web3.utils.toWei('0.01', 'ether'),
		};

		await contracts.ExecutionPermissions.tip(tx_options);

		balances.contract.after = await web3.eth.getBalance(contracts.ExecutionPermissions.address);

		assert.equal(balances.contract.after, tx_options.value, 'Failed to tip');
	});

	//
	it('`.withdraw(to,amount)` -- Allowed from owner', async () => {
		const balances = {
			contract: {
				before: NaN,
				after: NaN,
			},
			recipient: {
				before: NaN,
				after: NaN,
			},
		} as {
			contract: {
				before: number | string;
				after: number | string;
			};
			recipient: {
				before: number | string;
				after: number | string;
			};
		};

		const value = web3.utils.toWei('0.01', 'ether');

		//
		{
			balances.contract.before = await web3.eth.getBalance(contracts.ExecutionPermissions.address);

			const tx_options = {
				from: tipper,
				value,
			};

			await contracts.ExecutionPermissions.tip(tx_options);

			balances.contract.after = await web3.eth.getBalance(contracts.ExecutionPermissions.address);

			assert.equal(balances.contract.after, tx_options.value, 'Failed to tip');
		}

		//
		{
			balances.recipient.before = await web3.eth.getBalance(recipient);

			balances.contract.before = await web3.eth.getBalance(contracts.ExecutionPermissions.address);

			const tx_options = { from: owner };
			await contracts.ExecutionPermissions.withdraw(recipient, value, tx_options);

			balances.recipient.after = await web3.eth.getBalance(recipient);

			balances.contract.after = await web3.eth.getBalance(contracts.ExecutionPermissions.address);

			assert.notEqual(
				balances.contract.before,
				balances.contract.after,
				'Failed to reduce contract balance'
			);

			// assert.notEqual(
			//   balances.recipient.before,
			//   balances.recipient.after,
			//   "Failed to increase recipient balance"
			// );
		}
	});
});

//
contract('ExecutionPermissions.withdraw -- Error', (accounts) => {
	const owner = accounts[0];
	const tipper = accounts[1];
	const recipient = accounts[2];
	const bad_actor = accounts.at(-1);

	const contracts = {} as {
		ExecutionPermissions: IExecutionPermissionsInstance;
	};

	let snapshot_id: JsonRpcResponse['id'];

	//
	beforeEach(async () => {
		snapshot_id = ((await takeSnapShot()) as JsonRpcResponse).result;
		contracts.ExecutionPermissions = await ExecutionPermissions.deployed();
	});

	//
	afterEach(async () => {
		await revertToSnapShot(snapshot_id);
	});

	//
	it('`.withdraw(to,amount)` -- Rejects non-contract owner', async () => {
		const expected = 'ExecutionPermissions: caller not owner';

		let caught_error;
		try {
			const tx_options = { from: bad_actor };

			await contracts.ExecutionPermissions.withdraw(recipient, '1', tx_options);
		} catch (revert) {
			if ((revert as Extended_Types.Truffle.Revert).reason !== expected) {
				console.error(revert);
			}

			assert.equal(
				(revert as Extended_Types.Truffle.Revert).reason,
				expected,
				'Failed to catch expected `revert.reason`'
			);
			caught_error = true;
		}

		assert.equal(caught_error, true, 'Failed to catch any error');
	});
});
