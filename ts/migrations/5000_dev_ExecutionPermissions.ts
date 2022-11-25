// vim: noexpandtab
/// <reference types="../../@types/truffle-v5/types" />
'use strict';

import path from 'path';

module.exports = (deployer: Truffle.Deployer, network: string, accounts: Truffle.Accounts) => {
	if (network !== 'development') {
		const file_name = path.basename(__filename);
		console.warn(`Skipped ${file_name} because network is`, network);
		return;
	}

	const ExecutionPermissions = artifacts.require('ExecutionPermissions');

	const parameters = {
		// owner: accounts[0],
	};

	deployer.deploy(ExecutionPermissions, ...Object.values(parameters));
};
