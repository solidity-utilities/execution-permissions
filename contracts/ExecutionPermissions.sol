// SPDX-License-Identifier: AGPL-3.0
pragma solidity >=0.4.22 <0.9.0;

/* prettier-ignore */
import {
    IExecutionPermissions_Events,
    IExecutionPermissions_Functions,
    BatchPermissionEntry
} from "./interfaces/IExecutionPermissions.sol";

import { IOwnable } from "./interfaces/IOwnable.sol";

/// @title Utility contract for setting/enforcing execution permissions per function
/// @author S0AndS0
contract ExecutionPermissions is
    IExecutionPermissions_Events,
    IExecutionPermissions_Functions
{
    /// Map contract to function target to caller to permission
    /// @dev See {IExecutionPermissions_Variables-permissions}
    mapping(address => mapping(bytes4 => mapping(address => bool)))
        public permissions;

    /// Map contract to registered state
    /// @dev See {IExecutionPermissions_Variables-registered}
    mapping(address => bool) public registered;

    /// Store current owner of this contract instance
    /// @dev See {IExecutionPermissions_Variables-owner}
    address public owner;

    /// Store address of possible new owner of this contract instance
    /// @dev See {IExecutionPermissions_Variables-nominated_owner}
    address public nominated_owner;

    ///
    constructor() {
        owner = msg.sender;
        emit OwnershipClaimed(address(0), msg.sender);
    }

    /*************************************************************************/
    /* Modifiers */
    /*************************************************************************/

    modifier onlyRegistered() {
        require(
            registered[msg.sender],
            "ExecutionPermissions: instance not registered"
        );
        _;
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "ExecutionPermissions: caller not owner");
        _;
    }

    /*************************************************************************/
    /* Views */
    /*************************************************************************/

    /// @dev See {IExecutionPermissions_Functions-isPermitted}
    function isPermitted(bytes4 target, address caller)
        external
        view
        virtual
        override
        onlyRegistered
        returns (bool)
    {
        return permissions[msg.sender][target][caller];
    }

    /// @dev See {IExecutionPermissions_Functions-isPermitted}
    function isPermitted(string memory target, address caller)
        external
        view
        virtual
        override
        onlyRegistered
        returns (bool)
    {
        return
            permissions[msg.sender][bytes4(keccak256(bytes(target)))][caller];
    }

    /*************************************************************************/
    /* Mutations */
    /*************************************************************************/

    /// @dev See {IExecutionPermissions_Functions-setBatchPermission}
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
            permissions[msg.sender][entry.target][entry.caller] = entry.state;

            unchecked {
                ++i;
            }
        }
    }

    /// @dev See {IExecutionPermissions_Functions-setTargetPermission}
    function setTargetPermission(
        bytes4 target,
        address caller,
        bool state
    ) external payable virtual override onlyRegistered {
        permissions[msg.sender][target][caller] = state;
    }

    /// @dev See {IExecutionPermissions_Functions-setRegistered}
    function setRegistered(bool state) external payable virtual override {
        require(
            msg.sender.code.length > 0,
            "ExecutionPermissions: instance not initialized"
        );

        registered[msg.sender] = state;
    }

    /// @dev See {IExecutionPermissions_Functions-setRegistered}
    function setRegistered(address ref, bool state)
        external
        payable
        virtual
        override
    {
        require(
            ref.code.length > 0,
            "ExecutionPermissions: instance not initialized"
        );

        address refOwner;
        try IOwnable(ref).owner() returns (address result) {
            refOwner = result;
        } catch {
            revert(
                "ExecutionPermissions: instance does not implement `.owner()`"
            );
        }

        require(
            msg.sender == refOwner,
            "ExecutionPermissions: not instance owner"
        );

        registered[ref] = state;
    }

    /// @dev See {IExecutionPermissions_Functions-tip}
    function tip() external payable virtual override {}

    /*************************************************************************/
    /* Administration */
    /*************************************************************************/

    /// @dev See {IExecutionPermissions_Functions-withdraw}
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

    /// @dev See {IExecutionPermissions_Functions-nominateOwner}
    function nominateOwner(address newOwner)
        external
        payable
        virtual
        override
        onlyOwner
    {
        require(
            newOwner != address(0),
            "ExecutionPermissions: new owner cannot be zero address"
        );

        nominated_owner = newOwner;
        emit OwnerNominated(owner, newOwner);
    }

    /// @dev See {IExecutionPermissions_Functions-claimOwnership}
    function claimOwnership() external payable virtual override {
        require(
            nominated_owner != address(0),
            "ExecutionPermissions: new owner cannot be zero address"
        );

        address previousOwner = owner;
        owner = msg.sender;
        emit OwnershipClaimed(previousOwner, msg.sender);
    }
}
