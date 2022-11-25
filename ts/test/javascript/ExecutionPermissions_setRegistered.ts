// vim: noexpandtab
'use strict';

const ExecutionPermissions = artifacts.require('ExecutionPermissions');
const ExampleUsage = artifacts.require('ExampleUsage');
const NotOwnable = artifacts.require('NotOwnable');

import { revertToSnapShot, takeSnapShot } from './lib/web3-ganache-helpers';

import { JsonRpcResponse } from 'web3-core-helpers';

import { Extended_Types } from '../../../@types/index';
import { ExecutionPermissionsInstance } from '../../../@types/truffle-v5/ExecutionPermissions';
import { ExampleUsageInstance } from '../../../@types/truffle-v5/ExampleUsage';
import { NotOwnableInstance } from '../../../@types/truffle-v5/NotOwnable';

//
contract('ExecutionPermissions.setRegistered -- Success', (accounts) => {
	const owner = accounts[0];

	const contracts = {} as {
		ExecutionPermissions: ExecutionPermissionsInstance;
		ExampleUsage: ExampleUsageInstance;
		NotOwnable: NotOwnableInstance;
	};

	let snapshot_id: JsonRpcResponse['id'];

	//
	beforeEach(async () => {
		snapshot_id = ((await takeSnapShot()) as JsonRpcResponse).result;

		contracts.ExecutionPermissions = await ExecutionPermissions.deployed();

		contracts.ExampleUsage = await ExampleUsage.new(contracts.ExecutionPermissions.address, {
			from: owner,
		});
	});

	//
	afterEach(async () => {
		await revertToSnapShot(snapshot_id);
	});

	//
	it('`setRegistered(address,bool)` -- Allows mutation of registered state from `ExampleUsage` owner', async () => {
		const ref = contracts.ExampleUsage.address;

		{
			const state = true;

			await contracts.ExecutionPermissions.methods['setRegistered(address,bool)'](ref, state, {
				from: owner,
			});

			const response = await contracts.ExecutionPermissions.registered(ref);

			return assert.equal(response, state, 'Failed to register');
		}

		{
			const state = false;

			await contracts.ExecutionPermissions.methods['setRegistered(address,bool)'](ref, state, {
				from: owner,
			});

			const response = await contracts.ExecutionPermissions.registered(ref);

			return assert.equal(response, state, 'Failed to unregister');
		}
	});

	//
	it('`setRegistered(bool)` -- Allows mutation from contract instance', async () => {
		const ref = contracts.ExampleUsage.address;

		{
			const state = true;

			await contracts.ExampleUsage.setRegistered(state, {
				from: owner,
			});

			const response = await contracts.ExecutionPermissions.registered(ref);

			return assert.equal(response, state, 'Failed to register');
		}

		{
			const state = false;

			await contracts.ExampleUsage.setRegistered(state, {
				from: owner,
			});

			const response = await contracts.ExecutionPermissions.registered(ref);

			return assert.equal(response, state, 'Failed to unregister');
		}
	});
});

//
contract('ExecutionPermissions.setRegistered -- Error', (accounts) => {
	const owner = accounts[0];

	const contracts = {} as {
		ExecutionPermissions: ExecutionPermissionsInstance;
		ExampleUsage: ExampleUsageInstance;
		NotOwnable: NotOwnableInstance;
	};

	let snapshot_id: JsonRpcResponse['id'];

	//
	beforeEach(async () => {
		snapshot_id = ((await takeSnapShot()) as JsonRpcResponse).result;

		contracts.ExecutionPermissions = await ExecutionPermissions.deployed();

		contracts.ExampleUsage = await ExampleUsage.new(contracts.ExecutionPermissions.address, {
			from: owner,
		});

		contracts.NotOwnable = await NotOwnable.new({
			from: owner,
		});
	});

	//
	afterEach(async () => {
		await revertToSnapShot(snapshot_id);
	});

	//
	it('`setRegistered(bool)` -- Rejects non-contract addresses', async () => {
		const expected = 'ExecutionPermissions: instance not initialized';

		let caught_error;
		try {
			await contracts.ExecutionPermissions.methods['setRegistered(bool)'](true, { from: owner });
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

	//
	it('`setRegistered(address,bool)` -- Rejects non-contract addresses', async () => {
		const expected = 'ExecutionPermissions: instance not initialized';

		let caught_error;
		try {
			await contracts.ExecutionPermissions.methods['setRegistered(address,bool)'](
				accounts[0],
				true,
				{ from: owner }
			);
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

	//
	it('`setRegistered(address,bool)` -- Rejects non-ownable contracts', async () => {
		const expected = 'ExecutionPermissions: instance does not implement `.owner()`';

		let caught_error;
		try {
			await contracts.ExecutionPermissions.methods['setRegistered(address,bool)'](
				contracts.NotOwnable.address,
				true,
				{ from: owner }
			);
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

	//
	it('`setRegistered(address,bool)` -- Rejects non-owner of referenced contract', async () => {
		const expected = 'ExecutionPermissions: not instance owner';

		let caught_error;
		try {
			await contracts.ExecutionPermissions.methods['setRegistered(address,bool)'](
				contracts.ExampleUsage.address,
				true,
				{ from: accounts[1] }
			);
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
