import {
  // GovernanceCharity,
  Registered as RegisteredEvent,
  Verified as VerifiedEvent,
  RequestedFunding as RequestedFundingEvent,
  CancelledFunding as CancelledFundingEvent,
} from "../generated/GovernanceCharity/GovernanceCharity";
import { Charity } from "../generated/schema";

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

export function handleRequestedFunding(event: RequestedFundingEvent): void {}

export function handleCancelledFunding(event: CancelledFundingEvent): void {}
