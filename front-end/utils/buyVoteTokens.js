import { ethers } from "ethers";
import contractConfig from "../deployments/goerli/GovernanceTreasury.json";

export async function buyVoteTokens(val) {
  const amount = Math.max(Number(val), 0.001);

  const { abi, address } = contractConfig;

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const contract = new ethers.Contract(address, abi, signer);

  try {
    const amountETH = ethers.utils.parseEther(amount.toString());
    const tx = await contract.deposit(
      "0x0000000000000000000000000000000000000000",
      amountETH,
      { value: amountETH, gasLimit: 80000000 }
    );
    await tx.wait(1);
  } catch (err) {
    console.error(err);
    throw Error(err.message);
  }

  return;
}
