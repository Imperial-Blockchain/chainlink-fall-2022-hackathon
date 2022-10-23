// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/** @dev This contract is the main interface for charities
        and allows charities to register and be verified
 */  
interface IGovernanceCharity {

    function register(address charity, bytes memory proof) external;

    function verify(address charity) external;

    function requestFunding(uint256 amount, uint256 timestamp) external returns (uint256 epoch);

    function cancelRequest(uint256 epoch) external;

    function changeFundingAmount(uint256 epoch, uint256 newAmount) external returns (bool isAccepted);

}