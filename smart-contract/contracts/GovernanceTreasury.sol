// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaces/IGovernanceTreasury.sol";
import "./interfaces/IGovernanceRegistry.sol";
import "./interfaces/ITokenRegistry.sol";
import "./interfaces/IGovernanceToken.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract GovernanceTreasury is IGovernanceTreasury {
    using SafeERC20 for IERC20;
    
    IGovernanceRegistry private immutable _registry;

    constructor(address registry_) {
        _registry = IGovernanceRegistry(registry_);
    }

    function deposit(
        address token,
        address from,
        uint256 amount
    ) external payable override {
        IGovernanceToken govToken = IGovernanceToken(_registry.governanceToken());
        if (token == address(0)) {
            // if ETH
            require(msg.value > 0, "No Funds");
            govToken.mint(msg.sender, msg.value);
        } else {
            // if not ETH
            require(msg.value == 0); // to make sure they don't send eth by mistake
            // check token is authorized
        }
    }

    function registry() external view override returns (address) {
        return address(_registry);
    }

    function sendFunds(address token, address receiver, uint256 amount) external {
        IERC20(token).safeTransfer(receiver, amount);
    }
}
