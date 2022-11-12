// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaces/ITokenRegistry.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenRegistry is ITokenRegistry, Ownable {
    mapping(address => bool) public override authorized;

    function add(address token) external onlyOwner {
        require(!authorized[token], "Already authorized");
        authorized[token] = true;
        // consider emitting an event
    }

    function remove(address token) external onlyOwner {
        require(authorized[token], "Not authorized");
        authorized[token] = false;
        // consider emitting an event
    }
}
