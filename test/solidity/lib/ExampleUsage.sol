// SPDX-License-Identifier: AGPL-3.0
pragma solidity >=0.4.22 <0.9.0;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

import { IExecutionPermissions, BatchPermissionEntry } from "../../../contracts/interfaces/IExecutionPermissions.sol";

/// @title Example of how to utilize ExecutionPermissions features
/// @author S0AndS0
contract ExampleUsage is Ownable {
    address private _permissionStore;

    mapping(address => uint256) public account_score;

    //
    constructor(address permissionStore_) Ownable() {
        _permissionStore = permissionStore_;
    }

    //
    modifier onlyPermitted() {
        require(
            IExecutionPermissions(_permissionStore).isPermitted(
                bytes4(msg.data),
                msg.sender
            ),
            "ExampleUsage: sender not permitted"
        );
        _;
    }

    //
    function setScore(uint256 value) external payable onlyPermitted {
        account_score[msg.sender] = value;
    }

    //
    function setRegistered(bool state) external payable virtual onlyOwner {
        IExecutionPermissions(_permissionStore).setRegistered(state);
    }

    //
    function setBatchPermission(BatchPermissionEntry[] memory entries)
        external
        payable
        virtual
        onlyOwner
    {
        IExecutionPermissions(_permissionStore).setBatchPermission(entries);
    }

    //
    function setTargetPermission(
        bytes4 target,
        address caller,
        bool state
    ) external payable virtual onlyOwner {
        IExecutionPermissions(_permissionStore).setTargetPermission(
            target,
            caller,
            state
        );
    }
}
