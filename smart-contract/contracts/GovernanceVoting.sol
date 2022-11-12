// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./interfaces/IGovernanceVoting.sol";
import "./interfaces/IGovernanceRegistry.sol";
import "./interfaces/IGovernanceTreasury.sol";
import "./interfaces/IGovernanceToken.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/Timers.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/math/SafeCast.sol";
import "@openzeppelin/contracts/governance/utils/IVotes.sol";

/** @dev GovernanceVoting contract modified from OZ's Governance.sol contract 
 */

contract GovernanceVoting is IGovernanceVoting {

    using SafeCast for uint256;
    using Timers for Timers.Timestamp;

    struct ProposalCore {
        Timers.Timestamp voteStart;
        Timers.Timestamp voteEnd;
        bool executed;
    }

    struct CharityState {
        address charity;
        uint256 amount;
        uint256 votes;
    }

    /**
        @dev Immutables and Constants
     */
    IGovernanceRegistry private immutable _registry;
    address private immutable nativeToken;
    uint256 private constant VOTING_PERIOD = 1 weeks;
    uint256 private constant VOTING_DELAY = 1 days;
    uint256 private constant DELAY_BETWEEN_VOTES = 1 days;

    string private BALLOT_TYPEHASH;

    /** @dev Storage and mappings
     */


    string private _name;

    mapping(uint256 => ProposalCore) private _proposals;

    // Used to store the current winner of a proposal
    mapping(uint256 => CharityState) private proposalWinners;

    mapping(uint256 => mapping(address => CharityState)) private charityVotes;

    // Stores the number of votes for every user for a proposal
    mapping(uint256 => mapping(address => uint256)) public override numVotes;
    
    // Used to store the timestamp of the proposal which has been queued/ongoing
    uint256 currentEpoch;

    /**
     * @dev Restricts a function so it can only be executed through governance proposals. For example, governance
     * parameter setters in {GovernorSettings} are protected using this modifier.
     *
     * The governance executing address may be different from the Governor's own address, for example it could be a
     * timelock. This can be customized by modules by overriding {_executor}. The executor is only able to invoke these
     * functions during the execution of the governor's {execute} function, and not under any other circumstances. Thus,
     * for example, additional timelock proposers are not able to change governance parameters without going through the
     * governance protocol (since v4.6).
     */
    modifier onlyGovernance() {
        require(msg.sender == _executor(), "Governor: onlyGovernance");
        _;
    }

    /**
     * @dev Sets the value for {name} and {registry}
     */
    constructor(string memory name_, address registry_, address _token) {
        _name = name_;
        // Set registry to allow for contract address lookup
        _registry = IGovernanceRegistry(registry_);

        nativeToken = _token;

        BALLOT_TYPEHASH = name_;
    }

    /** @dev Adds a charity to the current proposal
             This only works if the charity is in the correct snapshot
     */
    function addCharity(address charity, uint256 amount) external virtual override returns (uint256) {

        require(msg.sender == _registry.governanceCharity(), "Only Charity can call");

        // Make sure we have a proposal running
        require(currentEpoch > 0, "Proposal not running");

        // Fetch the current epoch
        ProposalCore storage proposal = _proposals[currentEpoch];

        // Make sure that the proposal voting has not started yet
        require(proposal.voteStart.getDeadline() > block.timestamp);

        // If all tests pass then add the charity
        CharityState storage entry = charityVotes[currentEpoch][charity];
        entry.charity = charity;
        entry.amount = amount;

        return currentEpoch;
    }

    function removeCharity(address charity) external virtual override {
        require(msg.sender == _registry.governanceCharity(), "Only Charity can call");

        // Make sure we have a proposal running
        require(currentEpoch > 0, "Proposal not running");

        // Fetch the current epoch
        ProposalCore storage proposal = _proposals[currentEpoch];

        // Make sure that the proposal voting has not started yet
        require(proposal.voteStart.getDeadline() > block.timestamp);

        // Completely wipe out the storage value
        delete charityVotes[currentEpoch][charity];
    }

    /**
     * @dev Function to receive ETH that will be handled by the governor (disabled if executor is a third party contract)
     */
    receive() external payable virtual {
        require(_executor() == address(this));
    }

    /**
     * @dev See {IGovernor-name}.
     */
    function name() public view virtual override returns (string memory) {
        return _name;
    }

    /**
     * @dev See {IGovernor-version}.
     */
    function version() public view virtual override returns (string memory) {
        return "1";
    }

    /**
     * @dev See {IGovernor-hashProposal}.
     *
     * The proposal id is produced by hashing the ABI encoded `targets` array, the `values` array, the `calldatas` array
     * and the descriptionHash (bytes32 which itself is the keccak256 hash of the description string). This proposal id
     * can be produced from the proposal data which is part of the {ProposalCreated} event. It can even be computed in
     * advance, before the proposal is submitted.
     *
     * Note that the chainId and the governor address are not part of the proposal id computation. Consequently, the
     * same proposal (with same operation and same description) will have the same id if submitted on multiple governors
     * across multiple networks. This also means that in order to execute the same operation twice (on the same
     * governor) the proposer will have to change the description in order to avoid proposal id conflicts.
     */
    function hashProposal(
        uint256 epoch
    ) public pure virtual override returns (uint256) {
        return epoch;
    }

    /**
     * @dev See {IGovernor-state}.
     */
    function state(uint256 proposalId) public view virtual override returns (ProposalState) {
        ProposalCore storage proposal = _proposals[proposalId];

        if (proposal.executed) {
            return ProposalState.Executed;
        }

        uint256 snapshot = proposalSnapshot(proposalId);

        if (snapshot == 0) {
            revert("Governor: unknown proposal id");
        }

        if (snapshot >= block.timestamp) {
            return ProposalState.Pending;
        }

        uint256 deadline = proposalDeadline(proposalId);

        if (deadline >= block.timestamp) {
            return ProposalState.Active;
        }

        // If we have passed the deadline without sending rewards out
        // Then we are in the queued state
        else {
            return ProposalState.Queued;
        }
    }

    /**
     * @dev See {IGovernor-proposalSnapshot}.
     */
    function proposalSnapshot(uint256 proposalId) public view virtual override returns (uint256) {
        return _proposals[proposalId].voteStart.getDeadline();
    }

    /**
     * @dev See {IGovernor-proposalDeadline}.
     */
    function proposalDeadline(uint256 proposalId) public view virtual override returns (uint256) {
        return _proposals[proposalId].voteEnd.getDeadline();
    }
    /**
     * @dev Get the voting weight of `account` at a specific `blockNumber`, for a vote as described by `params`.
     */
    function _getVotes(
        address account,
        uint256 blockNumber
    ) internal view virtual returns (uint256) {
        return IVotes(_registry.governanceToken()).getPastVotes(account, blockNumber);
    }

    /**
     * @dev Register a vote for `proposalId` by `account` with a given `support`, voting `weight` and voting `params`.
     *
     * Note: Support is generic and can represent various things depending on the voting system used.
     
    function _countVote(
        uint256 proposalId,
        address account,
        uint8 support,
        uint256 weight,
        bytes memory params
    ) internal virtual;

    */

    /**
     * @dev Default additional encoded parameters used by castVote methods that don't include them
     *
     * Note: Should be overridden by specific implementations to use an appropriate value, the
     * meaning of the additional params, in the context of that implementation
     */
    function _defaultParams() internal view virtual returns (bytes memory) {
        return "";
    }

    /**
     * @dev See {IGovernor-propose}.
     */
    function propose(
        string memory description
    ) public virtual override returns (uint256) {
        // ensure we do not have a proposal on already
        require(currentEpoch == 0, "Proposal is already running");

        uint256 epoch = block.timestamp;

        ProposalCore storage proposal = _proposals[epoch];
        
        require(proposal.voteStart.isUnset(), "Governor: proposal already exists");

        uint64 snapshot = block.timestamp.toUint64() + votingDelay().toUint64();
        uint64 deadline = snapshot + votingPeriod().toUint64();

        proposal.voteStart.setDeadline(snapshot);
        proposal.voteEnd.setDeadline(deadline);

        currentEpoch = epoch;

        emit ProposalCreated(
            epoch,
            msg.sender,
            snapshot,
            deadline,
            description
        );

        return epoch;
    }

    /**
     * @dev See {IGovernor-execute}.
            This function should only be called by a chainlink operator
     */
    function execute(
        uint256 proposalId
    ) public virtual override returns (uint256) {

        ProposalState status = state(proposalId);
        require(
            status == ProposalState.Queued,
            "Governor: proposal not successful"
        );

        emit ProposalExecuted(proposalId);

        _beforeExecute(proposalId);
        _execute(proposalId);
        _afterExecute(proposalId);

        return proposalId;
    }

    function votingDelay() override pure public returns (uint256) {
        return VOTING_DELAY;
    } 

    function votingPeriod() override pure public returns (uint256) {
        return VOTING_PERIOD;
    }

    /**
     * @dev Internal execution mechanism. Can be overridden to implement different execution mechanism
     */
    function _execute(
        uint256 proposalId
    ) internal virtual {
        // Fetch the charity which won the proposal
        CharityState memory charity = proposalWinners[proposalId];

        IGovernanceTreasury(_registry.governanceTreasury()).sendFunds(nativeToken, charity.charity, charity.amount);
        

    }

    /**
     * @dev Hook before execution is triggered.
     */
    function _beforeExecute(
        uint256 /* proposalId */
    ) internal  {

    }

    /**
     * @dev Hook after execution is triggered.
            Delete the executed epoch and then queue a new one
     */
    function _afterExecute(
        uint256 /* proposalId */
    ) internal {
        currentEpoch = 0;

        propose("");
    }

    /**
     * @dev See {IGovernor-getVotes}.
     */
    function getVotes(address account, uint256 blockNumber) public view virtual override returns (uint256) {
        return _getVotes(account, blockNumber);
    }

    function _castVote(uint256 proposalId, address voter, address charity, string memory description) internal returns (uint256 votes) {
        require(proposalId == currentEpoch, "Voting for invalid proposal");

        ProposalState status = state(proposalId);
        require(status == ProposalState.Active, "Not active proposal");

        // Get governance token
        IGovernanceToken govToken = IGovernanceToken(_registry.governanceToken());
        votes = govToken.balanceOf(voter);
        require(votes > 0, "No votes to vote with");

        numVotes[proposalId][voter] += votes;
        CharityState storage entry = charityVotes[proposalId][charity];

        // Make sure the charity actually registered
        require(entry.charity != address(0));
        entry.votes += votes;


        // If the new charity has overtaken the current leader in votes
        // Then rename them as leader
        if (charityVotes[proposalId][charity].votes > proposalWinners[proposalId].votes) {
            proposalWinners[proposalId] = charityVotes[proposalId][charity];
        }

        govToken.transferFrom(voter, address(this), votes);

        emit VoteCast(voter, proposalId, charity, votes, description);

        


    } 

    /**
     * @dev See {IGovernor-castVote}.
     */
    function castVote(uint256 proposalId, address charity) public virtual override returns (uint256) {
        address voter = msg.sender;
        return _castVote(proposalId, voter, charity, "");
    }

    /**
     * @dev See {IGovernor-castVoteWithReason}.
     */
    function castVoteWithReason(
        uint256 proposalId,
        address charity,
        string calldata reason
    ) public virtual override returns (uint256) {
        address voter = msg.sender;
        return _castVote(proposalId, voter, charity, reason);
    }

    /**
     * @dev See {IGovernor-castVoteBySig}.
    function castVoteBySig(
        uint256 proposalId,
        address charity,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public virtual override returns (uint256) {

        // @audit this is vulnerable to signature replay attacks rn
        address voter = ECDSA.recover(
            _hashTypedDataV4(keccak256(abi.encode(BALLOT_TYPEHASH, proposalId, charity))),
            v,
            r,
            s
        );
        return _castVote(proposalId, voter, charity, "");
    }
    */

    /**
     * @dev Address through which the governor executes action. Will be overloaded by module that execute actions
     * through another contract such as a timelock.
     */
    function _executor() internal view virtual returns (address) {
        return address(this);
    }


}