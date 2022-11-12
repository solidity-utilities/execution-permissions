// SPDX-License-Identifier: AGPL-3.0
pragma solidity >=0.4.22 <0.9.0;

struct BatchPermissionEntry {
    bytes4 target;
    address caller;
    bool state;
}

/// @author S0AndS0
interface IExecutionPermissions_Functions {
    /*************************************************************************/
    /* Views on-chain */
    /*************************************************************************/

    /// Check execution permissions of target function for given caller
    ///
    /// @param target Function ID to check
    /// @param caller Original `msg.sender` of targeted function
    ///
    /// @custom:examples
    ///
    /// ```solidity
    /// import {
    ///     IExecutionPermissions
    /// } from "./contracts/interfaces/IExecutionPermissions.sol";
    ///
    /// contract ExampleUsage {
    ///     /* ... */
    ///
    ///     address public refPermissions;
    ///
    ///     /* ... */
    ///
    ///     constructor(address _refPermissions) {
    ///         /* ... */
    ///         refPermissions = _refPermissions;
    ///     }
    ///
    ///     modifier onlyPermitted() {
    ///         require(
    ///             IExecutionPermissions(refPermissions).isPermitted(
    ///                 bytes4(msg.data),
    ///                 msg.sender
    ///             ),
    ///             "ExampleUsage: sender not permitted"
    ///         );
    ///         _;
    ///     }
    ///
    ///     function restricted() external onlyPermitted {
    ///         /* ... */
    ///     }
    ///
    ///     /* ... */
    /// }
    /// ```
    function isPermitted(bytes4 target, address caller)
        external
        view
        returns (bool);

    /// Check execution permissions of target function for given caller
    ///
    /// @param target Function signature to check
    /// @param caller Original `msg.sender` of targeted function
    ///
    /// @dev Note will cost more gas than `isPermitted(bytes4,address)` due to
    ///      implicit conversion of function signature string to ID
    ///
    /// @custom:examples
    ///
    /// ```solidity
    /// import {
    ///     IExecutionPermissions
    /// } from "./contracts/interfaces/IExecutionPermissions.sol";
    ///
    /// contract ExampleUsage {
    ///     /* ... */
    ///
    ///     address public refPermissions;
    ///
    ///     /* ... */
    ///
    ///     constructor(address _refPermissions) {
    ///         /* ... */
    ///         refPermissions = _refPermissions;
    ///     }
    ///
    ///     function restricted() external {
    ///         string memory target = "restricted()";
    ///         address caller = msg.sender;
    ///         require(isPermitted(target, caller), "Not permitted");
    ///         /* ... */
    ///     }
    ///
    ///     /* ... */
    /// }
    /// ```
    function isPermitted(string memory target, address caller)
        external
        view
        returns (bool);

    /*************************************************************************/
    /* Mutations */
    /*************************************************************************/

    /// Assign multiple permission entries in one transaction
    ///
    /// @param entries List of permissions to assign
    ///
    /// @dev Note may cost less gas due to fewer initialization transaction
    ///      fees of multiple `setTargetPermission(bytes4,address,bool)` calls
    ///
    /// @custom:examples
    ///
    /// ```solidity
    /// import {
    ///     IExecutionPermissions,
    ///     BatchPermissionEntry
    /// } from "./contracts/interfaces/IExecutionPermissions.sol";
    ///
    /// contract ExampleUsage {
    ///     /* ... */
    ///
    ///     address public owner;
    ///     address public refPermissions;
    ///
    ///     /* ... */
    ///
    ///     constructor(address _refPermissions) {
    ///         owner = msg.sender;
    ///         refPermissions = _refPermissions;
    ///     }
    ///
    ///     /* ... */
    ///
    ///     modifier onlyOwner() {
    ///         require(msg.sender == owner, "ExampleUsage: sender not permitted");
    ///         _;
    ///     }
    ///
    ///     /* ... */
    ///
    ///     function setBatchPermission(BatchPermissionEntry[] memory entries)
    ///         external
    ///         onlyOwner
    ///     {
    ///         IExecutionPermissions(refPermissions).setBatchPermission(entries);
    ///     }
    /// }
    /// ```
    function setBatchPermission(BatchPermissionEntry[] memory entries)
        external
        payable;

    /// Assign single function caller permission state
    ///
    /// @param target Function ID to set caller permission
    /// @param caller Original `msg.sender` of targeted function
    /// @param state Value to assign for function caller interaction
    ///
    /// @custom:examples
    ///
    /// ```solidity
    /// import {
    ///     IExecutionPermissions,
    ///     BatchPermissionEntry
    /// } from "./contracts/interfaces/IExecutionPermissions.sol";
    ///
    /// contract ExampleUsage {
    ///     /* ... */
    ///
    ///     address public owner;
    ///     address public refPermissions;
    ///
    ///     /* ... */
    ///
    ///     constructor(address _refPermissions) {
    ///         owner = msg.sender;
    ///         refPermissions = _refPermissions;
    ///     }
    ///
    ///     /* ... */
    ///
    ///     modifier onlyOwner() {
    ///         require(msg.sender == owner, "ExampleUsage: sender not permitted");
    ///         _;
    ///     }
    ///
    ///     /* ... */
    ///
    ///     function setTargetPermission(
    ///         bytes4 target,
    ///         address caller,
    ///         bool state
    ///     ) external onlyOwner {
    ///         IExecutionPermissions(refPermissions).setTargetPermission(
    ///             target,
    ///             caller,
    ///             state
    ///         );
    ///     }
    /// }
    /// ```
    function setTargetPermission(
        bytes4 target,
        address caller,
        bool state
    ) external payable;

    /// Set registration state for referenced contract instance
    ///
    /// @param state Set `true` for registered and `false` for unregistered (default)
    ///
    /// @dev Note upgrade `refPermissions` features _should_ consider calling
    ///      this with `false` before calling new reference with `true`
    ///
    /// @custom:examples
    ///
    /// ```solidity
    /// import {
    ///     IExecutionPermissions
    /// } from "./contracts/interfaces/IExecutionPermissions.sol";
    ///
    /// contract ExampleUsage {
    ///     /* ... */
    ///
    ///     address public owner;
    ///     address public refPermissions;
    ///
    ///     /* ... */
    ///
    ///     constructor(address _refPermissions) {
    ///         owner = msg.sender;
    ///         refPermissions = _refPermissions;
    ///     }
    ///
    ///     /* ... */
    ///
    ///     modifier onlyOwner() {
    ///         require(msg.sender == owner, "ExampleUsage: sender not permitted");
    ///         _;
    ///     }
    ///
    ///     /* ... */
    ///
    ///     function setRegistered(bool state) external onlyOwner {
    ///         IExecutionPermissions(refPermissions).setRegistered(state);
    ///     }
    /// }
    /// ```
    function setRegistered(bool state) external payable;

    /// Show some support developers of this contract
    function tip() external payable;

    /*************************************************************************/
    /* Administration */
    /*************************************************************************/

    /// Allow contract owner to receive tips
    ///
    /// @param to Where to send Ethereum
    /// @param amount Measured in Wei
    function withdraw(address to, uint256 amount) external payable;
}

///
interface IExecutionPermissions_Variables {
    ///
    function permissions(
        address ref,
        bytes4 target,
        address caller
    ) external view returns (bool);

    ///
    function registered(address ref) external view returns (bool);
}

interface IExecutionPermissions is
    IExecutionPermissions_Functions,
    IExecutionPermissions_Variables
{}
