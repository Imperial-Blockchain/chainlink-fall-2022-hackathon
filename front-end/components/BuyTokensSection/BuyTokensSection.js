import { ConnectButton } from "web3uikit";
import { useRouter } from "next/router";
import { buyVoteTokens } from "../../utils";

import { useRef } from "react";

const BuyTokensSection = () => {
  const router = useRouter();
  const amountRef = useRef();

  console.dir(amountRef);

  const handleVoteNowClick = () => {
    router.push("/current-contest");
  };

  return (
    <div className="mx-auto my-2 flex flex-col items-center justify-center bg-gray-800 text-gray-100 p-3 max-w-md rounded-lg">
      <h3 className="mb-2 text-lg font-bold">Step 1: Connect your wallet</h3>

      <ConnectButton className="" moralisAuth={false} />

      <h3 className="mt-3 mb-2 text-lg font-bold">Step 2: Buy voting tokens</h3>

      <input
        className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-2 leading-tight focus:outline-none focus:bg-white"
        type="number"
        placeholder="Amount of ETH to Transfer / Min: 0.001 ETH"
        ref={amountRef}
      />
      <button
        onClick={() => buyVoteTokens(amountRef.current.value)}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-2 rounded"
      >
        Buy tokens
      </button>

      <h3 className="mt-3 mb-2 text-lg font-bold">Step 3: Help others</h3>

      <button
        className="bg-gray-100 hover:bg-gray-200 text-blue-900 font-bold py-2 px-4 mt-2 rounded"
        onClick={handleVoteNowClick}
      >
        Vote Now
      </button>
    </div>
  );
};

export default BuyTokensSection;
