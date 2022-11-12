// SPDX-License-Identifier: AGPL-3.0
pragma solidity >=0.4.22 <0.9.0;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

import { IExecutionPermissions_Functions, BatchPermissionEntry } from "./interfaces/IExecutionPermissions.sol";

import { IOwnable } from "./interfaces/IOwnable.sol";

/// @title Utility contract for setting/enforcing execution permissions per function
/// @author S0AndS0
contract ExecutionPermissions is IExecutionPermissions_Functions, Ownable {
    /// Map contract to function target to caller to permission
    mapping(address => mapping(bytes4 => mapping(address => bool)))
        public permissions;

    /// Map contract to registered state
    mapping(address => bool) public registered;

    constructor() Ownable() {}

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

    /*************************************************************************/
    /* Views on-chain */
    /*************************************************************************/

    /// @dev See {IExecutionPermissions-isPermitted}
    function isPermitted(bytes4 target, address caller)
        external
        view
        virtual
        override
        returns (bool)
    {
        return permissions[msg.sender][target][caller];
    }

    /// @dev See {IExecutionPermissions-isPermitted}
    function isPermitted(string memory target, address caller)
        external
        view
        virtual
        override
        returns (bool)
    {
        return
            permissions[msg.sender][bytes4(keccak256(bytes(target)))][caller];
    }

    /*************************************************************************/
    /* Mutations */
    /*************************************************************************/

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
            permissions[msg.sender][entry.target][entry.caller] = entry.state;

            unchecked {
                ++i;
            }
        }
    }

    /// @dev See {IExecutionPermissions-setTargetPermission}
    function setTargetPermission(
        bytes4 target,
        address caller,
        bool state
    ) external payable virtual override onlyRegistered {
        permissions[msg.sender][target][caller] = state;
    }

    /// @dev See {IExecutionPermissions-setRegistered}
    function setRegistered(bool state) external payable virtual override {
        require(
            msg.sender.code.length > 0,
            "ExecutionPermissions: instance not initialized"
        );

        registered[msg.sender] = state;
    }

    /// @dev See {IExecutionPermissions-tip}
    function tip() external payable virtual override {}

    /*************************************************************************/
    /* Administration */
    /*************************************************************************/

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
