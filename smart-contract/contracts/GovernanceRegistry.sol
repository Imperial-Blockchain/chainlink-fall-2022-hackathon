// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IGovernanceRegistry.sol";


/** @dev A very simple registry
 */
contract GovernanceRegistry is IGovernanceRegistry, Ownable {

    //----- Storage variables -----
    address public govToken;
    address public govCharity;
    address public govVoter;
    address public govTreasury;

    constructor(address _govToken, address _govCharity, address _govVoter, address _govTreasury) 
        Ownable() 
    {
        govToken = _govToken;
        govCharity = _govCharity;
        govVoter = _govVoter;
        govTreasury = _govTreasury;
    }

    function setGovToken(address token) onlyOwner {
        govToken = token;
    }

    function setCharity(address charity) onlyOwner {
        govCharity = charity;
    }

    function setGovVoter(address voter) onlyOwner {
        govVoter = voter;
    }

    function setGovTreasury(address treasury) onlyOwner {
        govTreasury = treasury;
    }