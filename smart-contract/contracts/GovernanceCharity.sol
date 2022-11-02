// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./interfaces/IGovernanceCharity.sol";
import "./interfaces/IGovernanceVoting.sol";
import "./interfaces/IGovernanceRegistry.sol";

contract GovernanceCharity is IGovernanceCharity, Ownable {
    //----------------------------------------------------- storage

    uint256 public override requestCounter;

    address public immutable override registry;

    mapping(address => Status) private _status;

    mapping(uint256 => Request) private _requests;

    //----------------------------------------------------- modifiers

    modifier onlyVerified(address operator) {
        require(_status[operator] == Status.Verified, "Not verified");
        _;
    }

    //----------------------------------------------------- misc functions

    constructor(address _registry) Ownable() {
        registry = _registry;
    }

    function register(bytes calldata proof) external override {
        require(_status[msg.sender] == Status.None, "Already registered");

        _status[msg.sender] = Status.Registered;

        emit Registered(msg.sender, proof);
    }

    function verify(address charity) external override onlyOwner {
        require(_status[charity] == Status.Registered, "Not registered");

        _status[charity] = Status.Verified;
        emit Verified(charity);
    }

    function requestFunding(uint256 amount)
        external
        override
        onlyVerified(msg.sender)
        returns (uint256 epoch)
    {
        // Check we have non-zero amount
        require(amount > 0, "Must request non-zero amounts");

        // Make a call to GovernanceVoting to try add the charity to the current proposal
        epoch = IGovernanceVoting(IGovernanceRegistry(registry).governanceVoter()).addCharity(msg.sender, amount);
    }

    function cancelRequest() 
        external
        override
        onlyVerified(msg.sender) 
    {
        // Wipe out charity entry from a pending proposal
        IGovernanceVoting(IGovernanceRegistry(registry).governanceVoter()).removeCharity(msg.sender);
    }

    //----------------------------------------------------- accessors

    function notFunded(uint256 requestId) external view override returns (bool) {
        Request memory request = _requests[requestId];
        return request.charity != address(0) && !request.funded;
    }

    function statusOf(address charity) external view override returns (Status) {
        return _status[charity];
    }

    function getFundingRequest(uint256 requestId) external view override returns (Request memory) {
        return _requests[requestId];
    }
}
