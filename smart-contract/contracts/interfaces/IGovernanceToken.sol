// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IGovernanceToken {
    function mint(address to, uint amount) external;

    function burn(address account, uint amount) external;

    function updateGovernorContract(address governorContract) external;

    function governorContract() external view returns (address);
}