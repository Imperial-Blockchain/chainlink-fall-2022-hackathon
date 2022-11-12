// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ITokenRegistry {
    function add(address token) external;

    function remove(address token) external;

    function authorized(address token) external view returns (bool);
}
