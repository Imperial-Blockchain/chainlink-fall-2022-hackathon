// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MockOracle {

    int256 public price;
    uint8 public decimals;

    function setPrice(int256 _price) external {
        price = _price;
    }

    function latestRoundData() external view
    returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    ) {
        return (0, price, block.timestamp, block.timestamp, 0);
    }

    function setDecimals(uint8 _decimals) external {
        decimals = _decimals;
    }

}