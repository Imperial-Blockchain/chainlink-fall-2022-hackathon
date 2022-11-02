// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/** @dev This contract is the main interface for charities
        and allows charities to register and be verified
 */
interface IGovernanceCharity {
    //----------------------------------------------------- types

    enum Status {
        None,
        Registered,
        Verified
    }

    struct Request {
        address charity;
        bool funded;
        uint256 amount;
    }

    //----------------------------------------------------- events

    /// @notice Emitted when a charity is registered to be verified.
    event Registered(address charity, bytes proof);

    /// @notice Emitted when a charity is verified.
    event Verified(address charity);

    //----------------------------------------------------- external functions

    function register(bytes calldata proof) external;

    function verify(address charity) external;

    function requestFunding(uint256 amount) external returns (uint256 epoch);

    function cancelRequest(uint256 epoch) external;

    //----------------------------------------------------- accessor functions

    function notFunded(uint256 requestId) external view returns (bool);

    function requestCounter() external view returns (uint256);

    function registry() external view returns (address);

    function statusOf(address charity) external view returns (Status);

    function getFundingRequest(uint256 requestId) external view returns (Request memory);
}
