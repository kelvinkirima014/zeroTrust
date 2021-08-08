const { ethers } = require('ethers');
const hre = require('hardhat');

async function main() {
  const[deployer] = await hre.ethers.getSigners();

  console.log(
    "Deploying contracts with the account:",
    deployer.address
  );
  const Deed = await hre.ethers.getContractFactory("Deed");
  
  const deed = await Deed.deploy({ value: ethers.utils.parseEther("2.0")});

  await deed.deployed();
  console.log("contracts deployed to:", deed.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  })