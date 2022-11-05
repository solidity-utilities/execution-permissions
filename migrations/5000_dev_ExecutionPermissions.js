"use strict";

const path = require("path");

module.exports = (deployer, network, accounts) => {
  if (network !== "development") {
    const file_name = path.basename(__filename);
    console.warn(`Skipped ${file_name} because network is`, network);
    return;
  }

  const ExecutionPermissions = artifacts.require("ExecutionPermissions");

  const parameters = {};

  deployer.deploy(ExecutionPermissions, ...Object.values(parameters));
};
