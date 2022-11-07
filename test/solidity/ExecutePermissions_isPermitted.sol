// SPDX-License-Identifier: AGPL-3.0
pragma solidity >=0.4.22 <0.9.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";

import { ExampleUsage } from "./lib/ExampleUsage.sol";

import { ExecutionPermissions } from "../../contracts/ExecutionPermissions.sol";

import { IExecutionPermissions, BatchPermissionEntry } from "../../contracts/interfaces/IExecutionPermissions.sol";

/// @title Example of intentions
/// @author S0AndS0
contract Test_ExecutionPermissions__ExampleUsage {
    address owner = address(this);

    ExecutionPermissions permissionStore;
    ExampleUsage example;

    function beforeEach() public {
        permissionStore = new ExecutionPermissions();
        example = new ExampleUsage(address(permissionStore));
    }

    //
    function test__setRegistered() public {
        example.setRegistered(true);

        Assert.isTrue(true, "WAT");
    }

    //
    function test__setBatchPermission__setScore() public {
        example.setRegistered(true);

        BatchPermissionEntry memory entry;
        entry.target = bytes4(keccak256(bytes("setScore(uint256)")));
        entry.caller = address(this);
        entry.state = true;

        BatchPermissionEntry[] memory entries = new BatchPermissionEntry[](1);
        entries[0] = entry;

        example.setBatchPermission(entries);

        uint256 value = 42;
        example.setScore(value);

        Assert.equal(example.account_score(address(this)), value, "WAT");
    }

    //
    function test__setTargetPermission__setScore() public {
        example.setRegistered(true);

        bytes4 target = bytes4(keccak256(bytes("setScore(uint256)")));
        address caller = address(this);
        bool state = true;

        example.setTargetPermission(target, caller, state);

        uint256 value = 42;
        example.setScore(value);

        Assert.equal(example.account_score(address(this)), value, "WAT");
    }

    //
    function test__setScore__error() public {
        example.setRegistered(true);

        uint256 value = 42;
        try example.setScore(value) {
            Assert.isTrue(false, "Failed to catch expected error");
        } catch Error(string memory _reason) {
            Assert.equal(
                _reason,
                "ExampleUsage: sender not permitted",
                "Caught unexpected error reason"
            );
        }
    }
}
