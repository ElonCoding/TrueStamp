import hre from "hardhat";

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying TrueStampAmoy with account:", deployer?.address);

  const TrueStamp = await hre.ethers.getContractFactory("TrueStampAmoy");
  const trueStamp = await TrueStamp.deploy();
  await trueStamp.waitForDeployment();

  const address = await trueStamp.getAddress();
  console.log(`TrueStampAmoy deployed to: ${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
