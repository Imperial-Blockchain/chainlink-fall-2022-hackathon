// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaces/IGovernanceTreasury.sol";
import "./interfaces/IGovernanceRegistry.sol";
import "./interfaces/ITokenRegistry.sol";
import "./interfaces/IGovernanceToken.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IERC20Decimals {
    function decimals() external view returns (uint8);
}

contract GovernanceTreasury is IGovernanceTreasury {
    IGovernanceRegistry private immutable _registry;
    mapping(address => address) private _priceFeeds;

    constructor(IGovernanceRegistry registry_) {
        _registry = registry_;
    }

    /// @dev If ETH is sent, the function arguments are ignored.
    function deposit(address token, uint256 amount) external payable override {
        IGovernanceToken govToken = IGovernanceToken(_registry.governanceToken());
        if (msg.value > 0) {
            // if ETH
            govToken.mint(msg.sender, msg.value);
            emit Deposited(address(0), msg.value, msg.value);
        } else {
            // if not ETH
            // price feed exists, i.e. token is authorized
            // this contract approved to transferFrom amount
        }
    }

    function registry() external view override returns (address) {
        return address(_registry);
    }

    /// @dev Logic to get the amount of token votes to transfer: $$p_f \frac{p_t d_t}{p_{ETH} d_{ETH}} \frac{d_{ETH}}{d_t} = p_f d_f
    function _getAmountVoteToken(address tokenAddr) internal returns (uint256) {
        AggregatorV3Interface feed = AggregatorV3Interface(_priceFeeds[tokenAddr]);
        uint256 tokenDecimals = IERC20Decimals(tokenAddr).decimals(); // the decimals function is not mandatory according to EIP20
        uint256 decimals = uint256(feed.decimals());
        (, int256 price, , , ) = feed.latestRoundData();
    }
}
