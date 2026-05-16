import hre from "hardhat";

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying TrueStamp with account:", deployer?.address);

  const TrueStamp = await hre.ethers.getContractFactory("TrueStamp");
  const trueStamp = await TrueStamp.deploy();
  await trueStamp.waitForDeployment();

  const address = await trueStamp.getAddress();
  console.log(`TrueStamp deployed to: ${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
