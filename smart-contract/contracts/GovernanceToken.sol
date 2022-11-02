// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IGovernanceToken.sol";
import "./interfaces/IGovernanceRegistry.sol";

contract GovernanceToken is IGovernanceToken, ERC20Votes {
    //----------------------------------------------------- storage

    IGovernanceRegistry private immutable _registry;

    //----------------------------------------------------- modifiers

    modifier onlyTreasury(address sender) {
        require(sender == _registry.governanceTreasury(), "Not treasury");
        _;
    }

    //----------------------------------------------------- misc functions

    constructor(IGovernanceRegistry registry_)
        ERC20("GovernanceToken", "GT")
        ERC20Permit("GovernanceToken")
    {
        _registry = registry_;
    }

    //----------------------------------------------------- mint and burn

    function mint(address to, uint256 amount) external override onlyTreasury(msg.sender) {
        _mint(to, amount);
    }

    function burn(address account, uint256 amount) external override onlyTreasury(msg.sender) {
        _burn(account, amount);
    }

    //----------------------------------------------------- accessor functions

    function registry() external view override returns (address) {
        return address(_registry);
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
