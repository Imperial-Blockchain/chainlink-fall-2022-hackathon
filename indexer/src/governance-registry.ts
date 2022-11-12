import { GovernanceRegistryOwnershipTransferred as GovernanceRegistryOwnershipTransferredEvent } from "../generated/GovernanceRegistry/GovernanceRegistry"
import { GovernanceRegistryOwnershipTransferred } from "../generated/schema"

export function handleGovernanceRegistryOwnershipTransferred(
  event: GovernanceRegistryOwnershipTransferredEvent
): void {
  let entity = new GovernanceRegistryOwnershipTransferred(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner
  entity.save()
}
