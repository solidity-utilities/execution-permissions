// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

/// @dev See {@openzeppelin/contracts/access/Ownable.sol}
interface IOwnable {
    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    /// @dev See {Ownable-owner}
    function owner() external view returns (address);

    /// @dev See {Ownable-renounceOwnership}
    function renounceOwnership() external payable;

    /// @dev See {Ownable-transferOwnership}
    function transferOwnership(address newOwner) external payable;
}
