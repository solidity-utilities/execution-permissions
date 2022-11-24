'use strict';

const ExecutionPermissions = artifacts.require('ExecutionPermissions');

import { revertToSnapShot, takeSnapShot } from './lib/web3-ganache-helpers';
import { JsonRpcPayload, JsonRpcResponse } from 'web3-core-helpers';

import { ExecutionPermissionsInstance } from '../../../@types/truffle-v5/ExecutionPermissions';

//
contract('ExecutionPermissions.constructor', (accounts) => {
	const owner = accounts[0];

	const contracts = {} as {
		ExecutionPermissions: ExecutionPermissionsInstance;
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

	it('Gets expected owner', async () => {
		const response = await contracts.ExecutionPermissions.owner();
		return assert.equal(response, owner, 'Failed to get expected owner');
	});
});
