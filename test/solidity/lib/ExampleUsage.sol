// SPDX-License-Identifier: AGPL-3.0
pragma solidity >=0.4.22 <0.9.0;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

import { IExecutionPermissions } from "../../../contracts/interfaces/IExecutionPermissions.sol";

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
    function setTargetsPermission(
        bytes4[] memory targets,
        address caller,
        bool state
    ) external payable virtual onlyOwner {
        IExecutionPermissions(_permissionStore).setTargetsPermission(
            targets,
            caller,
            state
        );
    }
}
