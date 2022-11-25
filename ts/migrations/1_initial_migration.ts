// vim: noexpandtab
/// <reference types="../../@types/truffle-v5/types" />
'use strict';

const Migrations = artifacts.require('Migrations');

module.exports = function (deployer: Truffle.Deployer) {
	deployer.deploy(Migrations);
};
