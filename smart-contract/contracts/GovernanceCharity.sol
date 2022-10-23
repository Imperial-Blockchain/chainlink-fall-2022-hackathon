// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IGovernanceCharity.sol";

contract GovernanceCharity is IGovernanceCharity, Ownable {

    event Register(address charity, bytes proof);
    event Verify(address charity);

    //Set as immutable as this will not change
    address immutable registry;

    mapping(address => bool) isVerified;
    mapping(address => bool) isRegistered;

    modifier onlyVerified() {
        require(isVerified[msg.sender], "Not verified");
        _;
    }


    constructor(address _registry) Ownable() {
        registry = _registry;

    }

    function register(address charity, bytes memory proof) external {
        require(!isRegistered[charity] && !isVerified[charity], "Already registered");

        isRegistered[charity] = true;

        emit Register(charity, proof);
    }

    function verify(address charity) external onlyOwner {
        require(isRegistered[charity], "Not registered");
        require(!isVerified[charity], "Already verified");

        isVerified[charity] = true;
        emit Verify(charity);
    }

    function requestFunding(uint256 amount, uint256 timestamp) external onlyVerified returns (uint256 epoch) {

    }

    function cancelRequest(uint256 epoch) external {

    }

    function changeFundingAmount(uint256 epoch, uint256 newAmount) external returns (bool isAccepted) {

    }

}

