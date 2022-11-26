// vim: noexpandtab
'use strict';

const ExecutionPermissions = artifacts.require('ExecutionPermissions');

import { revertToSnapShot, takeSnapShot } from './lib/web3-ganache-helpers';

import { JsonRpcResponse } from 'web3-core-helpers';

import { Extended_Types } from '../../../@types/index';
import { IExecutionPermissionsInstance } from '../../../@types/truffle-v5/';

type Storage_Stub = {
	owner?: string;
	nominated_owner?: string;
};

//
contract('ExecutionPermissions.tip and ExecutionPermissions.withdraw -- Success', (accounts) => {
	const owner = accounts[0];
	const nominated_owner = accounts[1];
	const zero_address = `0x${'0'.repeat(40)}`;

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
	it('`.nominateOwner` -- Allowed from current owner', async () => {
		const storage = {
			before: {
				nominated_owner: undefined,
				owner: undefined,
			},
			after: {
				nominated_owner: undefined,
				owner: undefined,
			},
		} as {
			before: Storage_Stub;
			after: Storage_Stub;
		};

		storage.before.owner = await contracts.ExecutionPermissions.owner();
		storage.before.nominated_owner = await contracts.ExecutionPermissions.nominated_owner();

		const tx_options = { from: owner };

		await contracts.ExecutionPermissions.nominateOwner(nominated_owner, tx_options);

		storage.after.owner = await contracts.ExecutionPermissions.owner();
		storage.after.nominated_owner = await contracts.ExecutionPermissions.nominated_owner();

		assert.notEqual(
			storage.before.nominated_owner,
			storage.after.nominated_owner,
			'Failed to change `.nominated_owner`'
		);

		assert.equal(storage.before.owner, storage.after.owner, 'Unexpected mutation of `.owner`');

		assert.equal(
			storage.after.nominated_owner,
			nominated_owner,
			'Failed to set `.nominated_owner`'
		);
	});

	//
	it('`.claimOwnership` -- Allowed from nominated account', async () => {
		const storage = {
			before: {
				nominated_owner: undefined,
				owner: undefined,
			},
			after: {
				nominated_owner: undefined,
				owner: undefined,
			},
		} as {
			before: Storage_Stub;
			after: Storage_Stub;
		};

		storage.before.owner = await contracts.ExecutionPermissions.owner();
		storage.before.nominated_owner = await contracts.ExecutionPermissions.nominated_owner();

		// console.log('#> Nominate new owner');
		{
			const tx_options = { from: owner };
			await contracts.ExecutionPermissions.nominateOwner(nominated_owner, tx_options);
		}

		// console.log('#> Attempt to claim ownership');
		{
			const tx_options = { from: nominated_owner };
			await contracts.ExecutionPermissions.claimOwnership(tx_options);
		}

		storage.after.owner = await contracts.ExecutionPermissions.owner();
		storage.after.nominated_owner = await contracts.ExecutionPermissions.nominated_owner();

		assert.notEqual(storage.before.owner, storage.after.owner, 'Failed to change `.owner`');

		assert.equal(storage.after.owner, nominated_owner, 'Failed to set `.owner`');
	});
});

//
contract('ExecutionPermissions.tip and ExecutionPermissions.withdraw -- Error', (accounts) => {
	const owner = accounts[0];
	const nominated_owner = accounts[1];
	const bad_actor = accounts.at(-1);
	const zero_address = `0x${'0'.repeat(40)}`;

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
	it('`.nominateOwner` -- Rejects non-owner', async () => {
		const expected = 'ExecutionPermissions: caller not owner';

		const storage = {
			before: {
				nominated_owner: undefined,
				owner: undefined,
			},
			after: {
				nominated_owner: undefined,
				owner: undefined,
			},
		} as {
			before: Storage_Stub;
			after: Storage_Stub;
		};

		storage.before.owner = await contracts.ExecutionPermissions.owner();
		storage.before.nominated_owner = await contracts.ExecutionPermissions.nominated_owner();

		let caught_error;
		try {
			const tx_options = { from: bad_actor };

			await contracts.ExecutionPermissions.nominateOwner(nominated_owner, tx_options);
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

		storage.after.owner = await contracts.ExecutionPermissions.owner();
		storage.after.nominated_owner = await contracts.ExecutionPermissions.nominated_owner();

		assert.equal(
			storage.before.nominated_owner,
			storage.after.nominated_owner,
			'Unexpected mutation of `.nominated_owner`'
		);

		assert.equal(storage.before.owner, storage.after.owner, 'Unexpected mutation of `.owner`');

		assert.notEqual(
			storage.after.nominated_owner,
			nominated_owner,
			'Unexpected mutation of `.nominated_owner`'
		);

		assert.equal(caught_error, true, 'Failed to catch any error');
	});

	//
	it('`.nominateOwner` -- Rejects zero address', async () => {
		const expected = 'ExecutionPermissions: new owner cannot be zero address';

		const storage = {
			before: {
				nominated_owner: undefined,
				owner: undefined,
			},
			after: {
				nominated_owner: undefined,
				owner: undefined,
			},
		} as {
			before: Storage_Stub;
			after: Storage_Stub;
		};

		storage.before.owner = await contracts.ExecutionPermissions.owner();
		storage.before.nominated_owner = await contracts.ExecutionPermissions.nominated_owner();

		let caught_error;
		try {
			const tx_options = { from: owner };

			await contracts.ExecutionPermissions.nominateOwner(zero_address, tx_options);
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

		storage.after.owner = await contracts.ExecutionPermissions.owner();
		storage.after.nominated_owner = await contracts.ExecutionPermissions.nominated_owner();

		assert.equal(
			storage.before.nominated_owner,
			storage.after.nominated_owner,
			'Unexpected mutation of `.nominated_owner`'
		);

		assert.equal(storage.before.owner, storage.after.owner, 'Unexpected mutation of `.owner`');

		assert.notEqual(
			storage.after.nominated_owner,
			nominated_owner,
			'Unexpected mutation of `.nominated_owner`'
		);

		assert.equal(caught_error, true, 'Failed to catch any error');
	});
});
