// vim: noexpandtab
/// <reference types="../../@types/truffle-v5/types" />
'use strict';

import path from 'path';

module.exports = (deployer: Truffle.Deployer, network: string, accounts: Truffle.Accounts) => {
	const ExecutionPermissions = artifacts.require('ExecutionPermissions');

	const parameters = {};

	deployer.deploy(ExecutionPermissions, ...Object.values(parameters));
};
