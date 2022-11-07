// SPDX-License-Identifier: AGPL-3.0
pragma solidity >=0.4.22 <0.9.0;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

import { AExecutionPermissions } from "./abstractions/AExecutionPermissions.sol";

import { IExecutionPermissions, BatchPermissionEntry } from "./interfaces/IExecutionPermissions.sol";

import { IOwnable } from "./interfaces/IOwnable.sol";

/// @title Utility contract for setting/enforcing execution permissions per function
/// @author S0AndS0
contract ExecutionPermissions is
    AExecutionPermissions,
    IExecutionPermissions,
    Ownable
{
    constructor() Ownable() {}

    /// @dev See {AExecutionPermissions-_isPermitted}
    /// @dev See {IExecutionPermissions-isPermitted}
    function isPermitted(bytes4 target, address caller)
        external
        view
        virtual
        override
        returns (bool)
    {
        return _isPermitted(msg.sender, target, caller);
    }

    /// @dev See {AExecutionPermissions-_isPermitted}
    /// @dev See {IExecutionPermissions-isPermitted}
    function isPermitted(string memory target, address caller)
        external
        view
        virtual
        override
        returns (bool)
    {
        return
            _isPermitted(msg.sender, bytes4(keccak256(bytes(target))), caller);
    }

    /// @dev See {AExecutionPermissions-_setTargetPermission}
    /// @dev See {IExecutionPermissions-setBatchPermission}
    function setBatchPermission(BatchPermissionEntry[] memory entries)
        external
        payable
        virtual
        override
        onlyRegistered
    {
        uint256 length = entries.length;
        BatchPermissionEntry memory entry;
        for (uint256 i; i < length; ) {
            entry = entries[i];
            _setTargetPermission(entry.target, entry.caller, entry.state);

            unchecked {
                ++i;
            }
        }
    }

    /// @dev See {AExecutionPermissions-_setTargetPermission}
    /// @dev See {IExecutionPermissions-setTargetPermission}
    function setTargetPermission(
        bytes4 target,
        address caller,
        bool state
    ) external payable virtual override onlyRegistered {
        _setTargetPermission(target, caller, state);
    }

    /// @dev See {AExecutionPermissions-_setRegistered}
    /// @dev See {IExecutionPermissions-setRegistered}
    function setRegistered(bool state) external payable virtual override {
        require(
            msg.sender.code.length > 0,
            "ExecutionPermissions: instance not initialized"
        );

        _setRegistered(msg.sender, state);
    }

    /// @dev See {IExecutionPermissions-tip}
    function tip() external payable virtual override {}

    /// @dev See {IExecutionPermissions-withdraw}
    function withdraw(address to, uint256 amount)
        external
        payable
        virtual
        override
        onlyOwner
    {
        (bool success, ) = to.call{ value: amount }("");
        require(success, "ExecutionPermissions: transfer failed");
    }
}
