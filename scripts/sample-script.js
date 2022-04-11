// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { BigNumber } = require("ethers");
const hre = require("hardhat");
const ethers = hre.ethers;
const NFT = require("../artifacts/contracts/CFNT.sol/CFNFT.json");

const ERC20Abi = [
  "function totalSupply() external view returns (uint256)",
  "function transfer(address recipient, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function transferFrom(address sender, address recipient, uint256 amount) external returns (bool)",
  "function balanceOf(address account) external view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
  "function decimals() view returns (uint8)",
  "function symbol() public view virtual override returns (string memory)"
];

const provider = new ethers.providers.JsonRpcProvider("https://rpc-mainnet.maticvigil.com/v1/4b331c188697971af1cd6f05bb7065bc358b7e89");


// fetchies
const fetchSigner = async () => {
    const provider = new ethers.providers.JsonRpcProvider("https://rpc-mainnet.maticvigil.com/v1/4b331c188697971af1cd6f05bb7065bc358b7e89");
    const wsProvider = new ethers.providers.WebSocketProvider("wss://rpc-mainnet.maticvigil.com/ws/v1/4b331c188697971af1cd6f05bb7065bc358b7e89");
    
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
    
    const signer = wallet.connect(provider);
    const wsSigner = wallet.connect(provider);
    console.log(`connected to ${signer.address}`);
    
    return signer;
};//works


const fetchContract = async (address, abi, signer) => {
    const contract = new ethers.Contract(address, abi, signer);
    console.log(`loaded contract ${contract.address}`);
    return contract;
};//works

const approveToken = async (tokenAddress, spender) => {
    const signer = await fetchSigner();
    const ERC20Contract = await fetchContract(tokenAddress, ERC20Abi, signer);
    const tx = await ERC20Contract.approve(spender, ethers.constants.MaxUint256.sub(1), {gasPrice: ethers.utils.parseUnits('35', 'gwei'), gasLimit: 1000000});
    console.log(`approved Controller to spend your ${tokenAddress}`)
    const receipt = await tx.wait()
    return receipt
};//works


const mint = async (nftContract) => {
    const signer = await fetchSigner();
    const NFTContract = await fetchContract(nftContract, NFT.abi, signer);
    const tx = await NFTContract.mint({value: ethers.utils.parseUnits('100', 10), gasPrice: ethers.utils.parseUnits('35', 'gwei'), gasLimit: 1000000});
    // console.log(`approved Controller to spend your ${tokenAddress}`)
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


// 0x61cCe285013395AB905Bd9f43757922D000debbE

async function main() {
  // const nft = await deploy(
  //   "test nft1", 
  //   "tnft1", 
  //   10, 
  //   "https://gateway.pinata.cloud/ipfs/QmcNJwDXsuPWMQET7XbQNXoCsFHPDgcBZpL5MnrdQKhUA1", 
  //   "0x93F835b9a2eec7D2E289c1E0D50Ad4dEd88b253f",
  //   "0xfC484aFB55D9EA9E186D8De55A0Aa24cbe772a19",
  //   ethers.utils.parseUnits("42", 10),
  //   ethers.utils.parseUnits("58", 10)
  // )

  // await deploy(
  //   "test nft2", 
  //   "tnft2", 
  //   10, 
  //   "https://gateway.pinata.cloud/ipfs/QmcNJwDXsuPWMQET7XbQNXoCsFHPDgcBZpL5MnrdQKhUA1", 
  //   "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
  //   "0x93F835b9a2eec7D2E289c1E0D50Ad4dEd88b253f",
  //   "0xfC484aFB55D9EA9E186D8De55A0Aa24cbe772a19",
  //   ethers.utils.parseUnits("42", 10),
  //   ethers.utils.parseUnits("58", 10)
  // )

  // await deploy(
  //   "test nft3", 
  //   "tnft3", 
  //   10, 
  //   "https://gateway.pinata.cloud/ipfs/QmcNJwDXsuPWMQET7XbQNXoCsFHPDgcBZpL5MnrdQKhUA1", 
  //   "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
  //   "0x93F835b9a2eec7D2E289c1E0D50Ad4dEd88b253f",
  //   "0xfC484aFB55D9EA9E186D8De55A0Aa24cbe772a19",
  //   ethers.utils.parseUnits("42", 10),
  //   ethers.utils.parseUnits("58", 10)
  // )


  // await mint();
  // const signer = await fetchSigner();
  // const NFTContract = await fetchContract("0x61cCe285013395AB905Bd9f43757922D000debbE", NFT.abi, signer);
  // const tx = await NFTContract.DEV_FEE();
  // console.log(ethers.utils.formatUnits(tx, 18))
  // await approveToken("0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", "0xe5030784fe26f8596f4a99bcda889B866A8db86A");
  await mint("0xEAD21213566E1244e4c25F61a3dEA8bC5649e28a");
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');
  

  // We get the contract to deploy
  // const NFT = await hre.ethers.getContractFactory("CFNFT");
  // const nft = await NFT.deploy(
  //   "Test NFT",
  //   "CFNFT",
  //   42,
  //   "https://gateway.pinata.cloud/ipfs/QmfLkcBTGzh7u9Tg1gYpVHS1o5tDwfFhb6PwpQnbHzbgdw", // URI
  //   "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", // fee token
  //   "0x93F835b9a2eec7D2E289c1E0D50Ad4dEd88b253f", // treasury
  //   "0xfC484aFB55D9EA9E186D8De55A0Aa24cbe772a19", // dev
  //   ethers.utils.parseUnits("42", 15),       // treasury fee
  //   ethers.utils.parseUnits("58", 15)         // dev fee
  // );

  // await nft.deployed();

  // console.log("NFT deployed to:", nft.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
