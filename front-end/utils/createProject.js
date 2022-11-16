import { ethers } from "ethers";
import contractConfig from "../deployments/goerli/GovernanceCharity.json";

export async function createProject(name, description, websiteUrl, imgUrl) {
  const data = `${name}---${description}---${websiteUrl}---${imgUrl}`;
  const endocer = new TextEncoder();
  const encodedData = endocer.encode(data);

  const { abi, address } = contractConfig;

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const contract = new ethers.Contract(address, abi, signer);

  try {
    const tx = await contract.register(encodedData, { gasLimit: 80000000 });
    await tx.wait(1);
  } catch (err) {
    throw Error(err.message);
  }
  return;
}
