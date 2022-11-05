// SPDX-License-Identifier: AGPL-3.0
pragma solidity >=0.4.22 <0.9.0;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

import { AExecutionPermissions } from "./abstractions/AExecutionPermissions.sol";
import { IExecutionPermissions } from "./interfaces/IExecutionPermissions.sol";

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

    /// @dev See {AExecutionPermissions-_setRegistered}
    /// @dev See {IExecutionPermissions-setRegistered}
    function setRegistered(bool state) external payable virtual override {
        require(
            msg.sender.code.length > 0,
            "ExecutionPermissions: sender not an initialized contract"
        );

        _setRegistered(msg.sender, state);
    }

    /// @dev See {AExecutionPermissions-_setTargetsPermission}
    /// @dev See {IExecutionPermissions-setTargetsPermission}
    function setTargetsPermission(
        bytes4[] memory targets,
        address caller,
        bool state
    ) external payable virtual override {
        require(
            _isRegistered(msg.sender),
            "ExecutionPermissions: sender not registered"
        );

        _setTargetsPermission(targets, caller, state);
    }

    /// @dev See {IExecutionPermissions-withdraw}
    function withdraw(address to, uint256 amount)
        external
        payable
        virtual
        override
        onlyOwner
    {
        (bool success, ) = to.call{ value: amount }("");
        require(success, "Transfer failed");
    }
}
