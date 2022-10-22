// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IGovernanceTreasury {
    function sendFunds(address token, address to, uint256 amount) external;

    function deposit(address token, address from, uint256 amount) external;
}