// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IGovernanceTreasury {
    event Deposited(
        address indexed token,
        uint256 indexed tokenAmount,
        uint256 indexed voteTokenAmount
    );

    function deposit(address token, uint256 amount) external payable;

    function sendFunds(address token, address to, uint256 amount) external;

    function registry() external view returns (address);

    function setPriceFeed(address token, address feed) external;

    function getPriceFeed(address token) external view returns (address);
}
