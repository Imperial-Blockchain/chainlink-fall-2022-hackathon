import {
  ProposalCreated as ProposalCreatedEvent,
  ProposalExecuted as ProposalExecutedEvent,
  VoteCast as VoteCastEvent
} from "../generated/GovernanceVoting/GovernanceVoting"
import {
  ProposalCreated,
  ProposalExecuted,
  VoteCast
} from "../generated/schema"

export function handleProposalCreated(event: ProposalCreatedEvent): void {
  let entity = new ProposalCreated(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.epoch = event.params.epoch
  entity.proposer = event.params.proposer
  entity.startTimestamp = event.params.startTimestamp
  entity.endTimestamp = event.params.endTimestamp
  entity.description = event.params.description
  entity.save()
}

export function handleProposalExecuted(event: ProposalExecutedEvent): void {
  let entity = new ProposalExecuted(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.proposalId = event.params.proposalId
  entity.save()
}

export function handleVoteCast(event: VoteCastEvent): void {
  let entity = new VoteCast(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.voter = event.params.voter
  entity.proposalId = event.params.proposalId
  entity.charity = event.params.charity
  entity.votes = event.params.votes
  entity.description = event.params.description
  entity.save()
}
