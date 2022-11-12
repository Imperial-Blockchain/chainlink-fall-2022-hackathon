// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IGovernanceRegistry.sol";

/** @dev A very simple registry
 */
contract GovernanceRegistry is IGovernanceRegistry, Ownable {
    //----- Storage variables -----
    address public override governanceToken;
    address public override governanceCharity;
    address public override governanceVoter;
    address public override governanceTreasury;
    address public override tokenRegistry;


    function init(address token, address charity, address voter, address treasury, address registry) external onlyOwner {
        // Set contract addresses
        governanceToken = token;
        governanceCharity = charity;
        governanceVoter = voter;
        governanceTreasury = treasury;
        tokenRegistry = registry;
    }

    function setGovernanceToken(address token) external override onlyOwner {
        governanceToken = token;
    }

    function setGovernanceCharity(address charity) external override onlyOwner {
        governanceCharity = charity;
    }

    function setGovernanceVoter(address voter) external override onlyOwner {
        governanceVoter = voter;
    }

    function setGovernanceTreasury(address treasury) external override onlyOwner {
        governanceTreasury = treasury;
    }

    function setTokenRegistry(address registry) external override onlyOwner {
        tokenRegistry = registry;
    }
}
