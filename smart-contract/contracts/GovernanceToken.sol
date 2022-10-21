// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IGovernanceToken.sol";

contract GovernanceToken is IGovernanceToken, ERC20Votes, Ownable {
    //----------------------------------------------------- storage

    address public _governorContract;

    //----------------------------------------------------- modifiers

    modifier onlyGovernor(address sender) {
        if (sender != _governorContract) revert();
        _;
    }

    //----------------------------------------------------- misc functions

    constructor(address governorContract_) 
        ERC20("GovernanceToken", "GT") 
        ERC20Permit("GovernanceToken") 
        Ownable()
    {
        _governorContract = governorContract_;
    }

    //----------------------------------------------------- mint and burn

    function mint(address to, uint amount) external override onlyGovernor(msg.sender) {
        _mint(to, amount);
    }

    function burn(address account, uint amount) external override onlyGovernor(msg.sender) {
        _burn(account, amount);
    }

    //----------------------------------------------------- accessor functions

    function updateGovernorContract(address governorContract_) external override onlyOwner {
        _governorContract = governorContract_;
    }

    function governorContract() external view override returns (address) {
        return _governorContract;
    }

    //----------------------------------------------------- ERC20 overrides

    function _afterTokenTransfer(
      address from,
      address to,
      uint256 amount
    ) internal override(ERC20Votes) {
      super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount) internal override(ERC20Votes) {
      super._mint(to, amount);
    }

    function _burn(address account, uint256 amount) internal override(ERC20Votes) {
      super._burn(account, amount);
    }
  }