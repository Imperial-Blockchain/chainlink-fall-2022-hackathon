// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IGovernanceVoting {
    function startProposal() external returns (uint256 epoch, uint256 deadline);

    function vote(uint256 epoch, address charity) external returns (uint256 numVotes);

    function removeVote(uint256 epoch) external returns (uint256 votesRemoved);

    function endVote(uint256 epoch) external;

    function veto(uint256 epoch) external;

    function unveto(uint256 epoch) external;
}