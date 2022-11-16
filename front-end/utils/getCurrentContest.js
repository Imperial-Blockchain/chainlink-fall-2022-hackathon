import { useQuery, gql } from "@apollo/client";

const GET_CURRENT_CONTEST = gql`
    {FundingRequest {
    id: ID!
    charity: Bytes!
    amount: BigInt!
    epoch: BigInt!
    funded: Boolean!
    cancelled: Boolean!
  }}
`;

export function getCurrentContest() {}
