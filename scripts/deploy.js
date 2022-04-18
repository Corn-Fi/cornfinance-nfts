const { BigNumber } = require("ethers");
const hre = require("hardhat");
const ethers = hre.ethers;
const NFT = require("../artifacts/contracts/CFNT.sol/CFNFT.json");


// fetchies
const fetchSigner = async () => {
    const provider = new ethers.providers.JsonRpcProvider("YOUR_RPC");
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
    const signer = wallet.connect(provider);
    console.log(`connected to ${signer.address}`);
    return signer;
};//works


const fetchContract = async (address, abi, signer) => {
    const contract = new ethers.Contract(address, abi, signer);
    console.log(`loaded contract ${contract.address}`);
    return contract;
};//works


const mint = async (nftContract, feeAmount) => {
    const signer = await fetchSigner();
    const NFTContract = await fetchContract(nftContract, NFT.abi, signer);
    const tx = await NFTContract.mint({value: feeAmount, gasPrice: ethers.utils.parseUnits('35', 'gwei'), gasLimit: 1000000});
    const receipt = await tx.wait()
    return receipt
};


const deploy = async (name, symbol, maxSupply, URI, treasuryAddr, devAddr, treasuryFee, devFee) => {
    const signer = await fetchSigner();
    const NFT = await hre.ethers.getContractFactory("CFNFT");
    const nft = await NFT.deploy(name, symbol, maxSupply, URI, treasuryAddr, devAddr, treasuryFee, devFee);
    await nft.deployed();
    return nft.address;
}


async function main() {
  const nft = await deploy(
    "test nft1",                                                                          // name               
    "tnft1",                                                                              // symbol             
    42,                                                                                   // max supply
    "https://gateway.pinata.cloud/ipfs/QmcNJwDXsuPWMQET7XbQNXoCsFHPDgcBZpL5MnrdQKhUA1",   // uri                
    "0x93F835b9a2eec7D2E289c1E0D50Ad4dEd88b253f",                                         // treasury
    "0xfC484aFB55D9EA9E186D8De55A0Aa24cbe772a19",                                         // dev
    ethers.utils.parseUnits("42", 16),                                                    // treasury fee (MATIC)
    ethers.utils.parseUnits("58", 16)                                                     // dev fee (MATIC)
  )

  await deploy(
    "test nft2",                                                                        
    "tnft2",                                                                              
    42, 
    "https://gateway.pinata.cloud/ipfs/QmcNJwDXsuPWMQET7XbQNXoCsFHPDgcBZpL5MnrdQKhUA1",   
    "0x93F835b9a2eec7D2E289c1E0D50Ad4dEd88b253f",
    "0xfC484aFB55D9EA9E186D8De55A0Aa24cbe772a19",
    ethers.utils.parseUnits("42", 16),
    ethers.utils.parseUnits("58", 16)
  )

  await deploy(
    "test nft3",                                                                      
    "tnft3",                                                                           
    42, 
    "https://gateway.pinata.cloud/ipfs/QmcNJwDXsuPWMQET7XbQNXoCsFHPDgcBZpL5MnrdQKhUA1",   
    "0x93F835b9a2eec7D2E289c1E0D50Ad4dEd88b253f",
    "0xfC484aFB55D9EA9E186D8De55A0Aa24cbe772a19",
    ethers.utils.parseUnits("42", 16),
    ethers.utils.parseUnits("58", 16)
  )
}



// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
