// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IGovernanceRegistry {
    function governanceToken() external view returns (address token);

    function setGovernanceToken(address token) external;

    function governanceCharity() external view returns (address charity);

    function setGovernanceCharity(address charity) external;

    function governanceVoter() external view returns (address voting);

    function setGovernanceVoter(address voting) external;

    function governanceTreasury() external view returns (address treasury);

    function setGovernanceTreasury(address treasury) external;

    function tokenRegistry() external view returns (address);

    function setTokenRegistry(address registry) external;
}
