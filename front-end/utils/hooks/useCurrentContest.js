import { useQuery, gql } from "@apollo/client";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

const GET_CURRENT_CONTEST = gql`
  {
    charities(first: 5) {
      id
      account
      proof
      verified
    }
  }
`;

export function useCurrentContest() {
  const { loading, error, data } = useQuery(GET_CURRENT_CONTEST);
  const [contest, setContest] = useState(null);

  useEffect(() => {
    if (!data) return;

    const newCharities = data.charities.map((e) => {
      const [name, description, websiteUrl, imgUrl] = ethers.utils
        .toUtf8String(e.proof)
        .split("---");

      return {
        name,
        description,
        websiteUrl,
        imgUrl,
        address: e.id,
      };
    });

    setContest(newCharities);
  }, [data]);

  return [contest];
}
