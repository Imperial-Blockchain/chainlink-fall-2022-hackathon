import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
  // GovernanceCharity,
  Registered as RegisteredEvent,
  Verified as VerifiedEvent,
  RequestedFunding as RequestedFundingEvent,
  CancelledFunding as CancelledFundingEvent,
} from "../generated/GovernanceCharity/GovernanceCharity";
import { Charity, FundingRequest } from "../generated/schema";

export function handleRegistered(event: RegisteredEvent): void {
  let charity = Charity.load(event.params.charity.toHexString());
  if (!charity) {
    charity = new Charity(event.params.charity.toHexString());
  }
  charity.account = event.params.charity;
  charity.proof = event.params.proof;
  charity.verified = false;
  charity.save();
}

export function handleVerified(event: VerifiedEvent): void {
  let charity = Charity.load(event.params.charity.toHexString());
  if (!charity) {
    charity = new Charity(event.params.charity.toHexString());
    charity.account = event.params.charity;
  }
  charity.verified = true;
  charity.save();
}

export function handleRequestedFunding(event: RequestedFundingEvent): void {
  const id = getFundingRequestIdFromEventParams(
    event.params.charity,
    event.params.epoch
  );
  let fundingRequest = FundingRequest.load(id);
  if (!fundingRequest) {
    fundingRequest = new FundingRequest(id);
    fundingRequest.charity = event.params.charity;
  }
  fundingRequest.amount = event.params.amount;
  fundingRequest.epoch = event.params.epoch;
  fundingRequest.funded = false;
  fundingRequest.cancelled = false;
  fundingRequest.save();
}

export function handleCancelledFunding(event: CancelledFundingEvent): void {
  const id = getFundingRequestIdFromEventParams(
    event.params.charity,
    event.params.epoch
  );
  let fundingRequest = FundingRequest.load(id);
  fundingRequest!.cancelled = true;
  fundingRequest.save();
}

function getFundingRequestIdFromEventParams(
  charity: Address,
  epoch: BigInt
): string {
  return charity.toHexString() + epoch.toHexString();
}
