import {
  Deposited as DepositedEvent,
  GovernanceTreasuryOwnershipTransferred as GovernanceTreasuryOwnershipTransferredEvent
} from "../generated/GovernanceTreasury/GovernanceTreasury"
import {
  Deposited,
  GovernanceTreasuryOwnershipTransferred
} from "../generated/schema"

export function handleDeposited(event: DepositedEvent): void {
  let entity = new Deposited(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.token = event.params.token
  entity.tokenAmount = event.params.tokenAmount
  entity.voteTokenAmount = event.params.voteTokenAmount
  entity.save()
}

export function handleGovernanceTreasuryOwnershipTransferred(
  event: GovernanceTreasuryOwnershipTransferredEvent
): void {
  let entity = new GovernanceTreasuryOwnershipTransferred(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner
  entity.save()
}
