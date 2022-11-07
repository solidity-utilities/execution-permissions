// SPDX-License-Identifier: AGPL-3.0
pragma solidity >=0.4.22 <0.9.0;

/// @title Low-level internal functions for interacting with contract storage
/// @author S0AndS0
abstract contract AExecutionPermissions {
    /// Map contract to function target to caller to permission
    mapping(address => mapping(bytes4 => mapping(address => bool)))
        private _permissions;

    /// Map contract to registered state
    mapping(address => bool) private _registered;

    /*************************************************************************/
    /* Modifiers */
    /*************************************************************************/

    modifier onlyRegistered() {
        require(
            _isRegistered(msg.sender),
            "ExecutionPermissions: instance not registered"
        );
        _;
    }

    /*************************************************************************/
    /* Views */
    /*************************************************************************/

    /// @dev See {IExecutionPermissions-isPermitted}
    function _isPermitted(
        address sender,
        bytes4 target,
        address caller
    ) internal view virtual returns (bool) {
        return _permissions[sender][target][caller];
    }

    /// @dev See {IExecutionPermissions-isPermitted}
    function _isRegistered(address account)
        internal
        view
        virtual
        returns (bool)
    {
        return _registered[account];
    }

    /*************************************************************************/
    /* Mutations */
    /*************************************************************************/

    /// @dev See {IExecutionPermissions-setTargetPermission}
    function _setTargetPermission(
        bytes4 target,
        address caller,
        bool state
    ) internal virtual {
        _permissions[msg.sender][target][caller] = state;
    }

    /// @dev See {IExecutionPermissions-setRegistered}
    function _setRegistered(address account, bool state) internal virtual {
        _registered[account] = state;
    }
}
