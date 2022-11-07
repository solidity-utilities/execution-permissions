// SPDX-License-Identifier: AGPL-3.0
pragma solidity >=0.4.22 <0.9.0;

struct BatchPermissionEntry {
    bytes4 target;
    address caller;
    bool state;
}

/// @author S0AndS0
interface IExecutionPermissions {
    /*************************************************************************/
    /* Views */
    /*************************************************************************/

    //
    function isPermitted(bytes4 target, address caller)
        external
        view
        returns (bool);

    //
    function isPermitted(string memory target, address caller)
        external
        view
        returns (bool);

    /*************************************************************************/
    /* Mutations */
    /*************************************************************************/

    //
    function setBatchPermission(BatchPermissionEntry[] memory entries)
        external
        payable;

    //
    function setTargetPermission(
        bytes4 target,
        address caller,
        bool state
    ) external payable;

    //
    function setRegistered(bool state) external payable;

    //
    function tip() external payable;

    /*************************************************************************/
    /* Administration */
    /*************************************************************************/

    //
    function withdraw(address to, uint256 amount) external payable;
}
