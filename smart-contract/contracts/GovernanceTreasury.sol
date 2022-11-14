// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaces/IGovernanceTreasury.sol";
import "./interfaces/IGovernanceRegistry.sol";
import "./interfaces/ITokenRegistry.sol";
import "./interfaces/IGovernanceToken.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface IERC20Decimals {
    function decimals() external view returns (uint8);
}


contract GovernanceTreasury is IGovernanceTreasury, Ownable {
    using SafeERC20 for IERC20;

    uint internal constant ETH_DECIMALS = 18;
    IGovernanceRegistry private immutable _registry;
    mapping(address => address) private _priceFeeds;

    constructor(address registry_) {
        _registry = IGovernanceRegistry(registry_);
    }

    /// @dev If ETH is sent, the function arguments are ignored.
    function deposit(address tokenAddr, uint256 amount) external payable override {
        require(ITokenRegistry(_registry.tokenRegistry()).authorized(tokenAddr), "Invalid token address");

        IGovernanceToken govToken = IGovernanceToken(_registry.governanceToken());
        if (tokenAddr == address(0)) {
            // if ETH
            govToken.mint(msg.sender, msg.value);
            emit Deposited(address(0), msg.value, msg.value);
        } else {
            require(msg.value == 0, "Invalid msg amount");
            // if not ETH
            // price feed exists, i.e. token is authorized
            // this contract approved to transferFrom amount
            IERC20(tokenAddr).transferFrom(msg.sender, address(this), amount);
            uint voteAmount = _getAmountVoteToken(tokenAddr, amount);
            govToken.mint(msg.sender, voteAmount);
            emit Deposited(tokenAddr, amount, voteAmount);
        }
    }

    function sendFunds(address tokenAddr, address to, uint amount) external {
        // only governance voting
        require(msg.sender == _registry.governanceVoter(), "Unauthorised caller");

        // burn the governance tokens
        IGovernanceToken govToken = IGovernanceToken(_registry.governanceToken());
        govToken.burn(msg.sender, amount);

        if (tokenAddr == address(0)) {
            (bool success, ) = to.call{ value: amount, gas: 2300 }("");
            require(success, "Transfer failed");
        } else {
             IERC20(tokenAddr).safeTransfer(to, amount);
        }
        
        emit SentFunds(tokenAddr, to, amount);
    }

    function registry() external view override returns (address) {
        return address(_registry);
    }
    
    function setPriceFeed(address token, address feed) external override onlyOwner {
        _priceFeeds[token] = feed;
    }

    function getPriceFeed(address token) external view returns (address) {
        return _priceFeeds[token];
    }

    /// @dev Logic to get the amount of token votes to transfer: $$p_f \frac{p_t d_t}{p_{ETH} d_{ETH}} \frac{d_{ETH}}{d_t} = p_f d_f
    function _getAmountVoteToken(address tokenAddr, uint amount) internal view returns (uint256) {
        // check token authorized
        address feedAddr = _priceFeeds[tokenAddr];
        require(feedAddr != address(0), "Invalid Token");
        AggregatorV3Interface feed = AggregatorV3Interface(feedAddr);

        // get decimals
        uint8 tokenDecimals = IERC20Decimals(tokenAddr).decimals(); // the decimals function is not mandatory according to EIP20
        uint8 feedDecimals = feed.decimals();
        uint decimals = _getDecimals(tokenDecimals, feedDecimals);

        // get price
        (, int256 price, , , ) = feed.latestRoundData();
        require(price > 0, "Invalid Price");

        return ((10 ** decimals) * amount) / uint(price);
    }

    function _getDecimals(uint8 decimalsToken, uint8 decimalsFeed) internal pure returns (uint) {
        if (decimalsToken < decimalsFeed) return uint(ETH_DECIMALS + (decimalsFeed - decimalsToken));
        else if (decimalsToken < decimalsFeed) return uint(ETH_DECIMALS - (decimalsToken - decimalsFeed));
        return ETH_DECIMALS;
    }
}
