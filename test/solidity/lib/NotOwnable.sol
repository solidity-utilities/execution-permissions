// SPDX-License-Identifier: AGPL-3.0
pragma solidity >=0.4.22 <0.9.0;

import { IExecutionPermissions, BatchPermissionEntry } from "../../../contracts/interfaces/IExecutionPermissions.sol";

/// @title Contract used for testing error handling
/// @author S0AndS0
contract NotOwnable {
    address public permissionStore;
}
