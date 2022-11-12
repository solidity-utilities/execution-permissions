// SPDX-License-Identifier: AGPL-3.0
pragma solidity >=0.4.22 <0.9.0;

struct BatchPermissionEntry {
    bytes4 target;
    address caller;
    bool state;
}

/// @title Describe available functions
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
    /// @custom:throws "ExecutionPermissions: instance not registered"
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
    /// @custom:throws "ExecutionPermissions: instance not registered"
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
    /// @custom:throws "ExecutionPermissions: instance not registered"
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
    /// @custom:throws "ExecutionPermissions: instance not registered"
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

    /// Set registration state for calling contract instance
    ///
    /// @param state Set `true` for registered and `false` for unregistered (default)
    ///
    /// @dev Note upgrade `refPermissions` features _should_ consider calling
    ///      this with `false` before calling new reference with `true`
    ///
    /// @custom:throws "ExecutionPermissions: instance not initialized"
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

    /// Set registration state for referenced contract instance
    ///
    /// @param state Set `true` for registered and `false` for unregistered (default)
    ///
    /// @custom:throws "ExecutionPermissions: instance not initialized"
    /// @custom:throws "ExecutionPermissions: instance does not implement `.owner()`"
    /// @custom:throws "ExecutionPermissions: not instance owner"
    function setRegistered(address ref, bool state) external payable;

    /// Show some support developers of this contract
    ///
    /// @dev See (IExecutionPermissions)
    ///
    /// @custom:examples
    ///
    /// ### Node Web3JS show appreciation for owner of `ExecutionPermissions`
    ///
    /// ```javascript
    /// const { PRIVATE_KEY } = process.env;
    ///
    /// function tipAuthor({ ExecutionPermissions, sendOptions } = {}) {
    ///   sendOptions = Object.assign({ value: web3.utils.toWei("0.1") }, sendOptions);
    ///   return ExecutionPermissions.methods.tip().send(sendOptions);
    /// }
    ///
    /// if (PRIVATE_KEY) {
    ///   tipAuthor({
    ///     ExecutionPermissions,
    ///     sendOptions: {
    ///       from: web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY).address,
    ///       value: web3.utils.toWei("0.1") },
    ///     },
    ///   }).then((receipt) => {
    ///     console.log("tipAuthor ->", JSON.stringify({ receipt }, null, 2));
    ///   });
    /// }
    /// ```
    function tip() external payable;

    /*************************************************************************/
    /* Administration */
    /*************************************************************************/

    /// Allow owner of `ExecutionPermissions` to receive tips
    ///
    /// @param to Where to send Ethereum
    /// @param amount Measured in Wei
    function withdraw(address to, uint256 amount) external payable;
}

/// @title Describe public storage getter functions
/// @author S0AndS0
interface IExecutionPermissions_Variables {
    /// Check execution permissions of referenced contract function for given caller
    ///
    /// @dev See (IExecutionPermissions)
    ///
    /// @param ref Contract address with `target` function
    /// @param target Function ID to check
    /// @param caller Original `msg.sender` of targeted function
    ///
    /// @custom:examples
    ///
    /// ### Web3JS check permissions of contract function caller
    ///
    /// ```javascript
    /// function getTargetPermission({
    ///   ExecutionPermissions,
    ///   ref,
    ///   target,
    ///   caller,
    /// } = {}) {
    ///   if (target.length !== 10) {
    ///     target = web3.eth.abi.encodeFunctionSignature(target);
    ///   }
    ///   return ExecutionPermissions.methods.permissions(ref, target, caller).call();
    /// }
    ///
    /// getTargetPermission({
    ///   ExecutionPermissions,
    ///   ref: "0x0...1",
    ///   target: "someFunctionName(address,string,uint256)",
    ///   caller: "0x0...2",
    /// }).then((response) => {
    ///   console.assert(typeof response === "boolean", "Unexpected response type");
    ///   console.log("getTargetPermission ->", { response });
    /// });
    /// ```
    function permissions(
        address ref,
        bytes4 target,
        address caller
    ) external view returns (bool);

    /// Check registration status of referenced contract
    ///
    /// @dev See (IExecutionPermissions)
    ///
    /// @custom:examples
    ///
    /// ### Web3JS check registration status of contract
    ///
    /// ```javascript
    /// function getRegistrationStatus({
    ///   ExecutionPermissions,
    ///   ref,
    /// } = {}) {
    ///   return ExecutionPermissions.methods.registered(ref).call();
    /// }
    ///
    /// getTargetPermission({
    ///   ExecutionPermissions,
    ///   ref: '0x0...1',
    ///   target: "setBatchPermission(BatchPermissionEntry[])",
    ///   caller: ADDRESS,
    /// }).then((response) => {
    ///   console.assert(typeof response === "boolean", "Unexpected response type");
    ///   console.log("getTargetPermission ->", { response });
    /// });
    /// ```
    function registered(address ref) external view returns (bool);
}

/// @title Describe all functions available to third-parties
/// @author S0AndS0
///
/// @custom:examples
///
/// ### Node Web3JS initialize contract instance
///
/// ```javascript
/// const Web3 = require('web3');
///
/// const { abi } = require('./build/contracts/IExecutionPermissions.json');
///
/// const { ADDRESS } = process.env;
///
/// const web3 = new Web3('http://localhost:8545');
///
/// const ExecutionPermissions = new web3.eth.Contract(abi, ADDRESS);
/// ```
interface IExecutionPermissions is
    IExecutionPermissions_Functions,
    IExecutionPermissions_Variables
{

}
