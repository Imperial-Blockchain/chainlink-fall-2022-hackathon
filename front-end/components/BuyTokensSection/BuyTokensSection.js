import { ConnectButton } from "web3uikit";
import { useRouter } from "next/router";
import { buyVoteTokens } from "../../utils";

const BuyTokensSection = () => {
  const router = useRouter();

  const handleVoteNowClick = () => {
    router.push("/current-contest");
  };

  return (
    <div className="mx-auto my-2 flex flex-col items-center justify-center bg-gray-800 text-gray-100 p-3 max-w-md rounded-lg">
      <h3 className="mb-2 text-lg font-bold">Step 1: Connect your wallet</h3>

      <ConnectButton className="" moralisAuth={false} />

      <h3 className="mt-3 mb-2 text-lg font-bold">Step 2: Buy voting tokens</h3>

      <button
        onClick={buyVoteTokens}
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
