import hre from "hardhat";
import { TRUESTAMP_ABI } from "../src/contracts/contractConfig";

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  if (!deployer) {
    throw new Error("No deployer account found. Did you set PRIVATE_KEY in .env?");
  }
  
  console.log("Using account:", deployer.address);

  const contractAddress = "0x9092c1ebaDfb7e81cfc8911E1FbBFEb672e8444e";
  const userAddress = "0xFF00D19Db6668537116Ecda91ac07Fa448A2223e";
  
  // Use the ABI we saved in the frontend config
  const contract = new hre.ethers.Contract(contractAddress, TRUESTAMP_ABI, deployer);
  
  console.log(`Granting Institution role to ${userAddress}...`);
  const tx = await contract.addInstitution(userAddress);
  console.log("Tx hash:", tx.hash);
  
  await tx.wait();
  console.log("Role successfully granted!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
