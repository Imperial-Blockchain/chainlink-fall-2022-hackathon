// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IGovernanceCharity.sol";

contract GovernanceCharity is IGovernanceCharity, Ownable {
    //----------------------------------------------------- storage

    uint256 public override requestCounter;

    address public immutable override registry;

    mapping(address => Status) private _status;

    mapping(uint256 => Request) private _request;

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

    function requestFunding(uint256 amount, uint256 timestamp)
        external
        override
        onlyVerified(msg.sender)
        returns (uint256 epoch)
    {}

    function cancelRequest(uint256 epoch) external {}

    function changeFundingAmount(uint256 epoch, uint256 newAmount)
        external
        returns (bool isAccepted)
    {}

    //----------------------------------------------------- accessors

    function statusOf(address charity) external view override returns (Status) {
        return _status[charity];
    }

    function getFundingRequest(uint256 requestId) external view override returns (Request memory) {
        return _request[requestId];
    }
}
