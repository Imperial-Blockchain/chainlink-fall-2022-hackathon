// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IGovernanceRegistry {
    function govToken() view external returns (address token);

    function setGovToken(address token) external;

    function govCharity() view external returns (address charity);

    function setCharity(address charity) external;

    function govVoter() view external returns (address voting);

    function setGovVoter(address voting) external;

    function govTreasury() view external returns (address treasury);

    function setGovTreasury(address treasury) external;
    }