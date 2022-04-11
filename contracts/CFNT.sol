// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";


contract CFNFT is ERC721, Pausable, Ownable, ReentrancyGuard {
    using SafeMath for uint256;

    uint256 public immutable MAX_SUPPLY;
    address public immutable TREASURY_ADDRESS;
    address public immutable DEV_ADDRESS;
    uint256 public immutable TREASURY_FEE;
    uint256 public immutable DEV_FEE;

    string public BASE_URI;
    uint256 public totalSupply;
    mapping(address => bool) public nftOwners;

    // --------------------------------------------------------------------
    // --------------------------------------------------------------------

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _maxSupply,
        string memory _base_URI,
        address _treasuryAddress,
        address _devAddress,
        uint256 _treasuryFee,
        uint256 _devFee
    ) ERC721(_name, _symbol) {
        MAX_SUPPLY = _maxSupply;
        BASE_URI = _base_URI;
        TREASURY_ADDRESS = _treasuryAddress;
        DEV_ADDRESS = _devAddress;
        TREASURY_FEE = _treasuryFee;
        DEV_FEE = _devFee;
    }

    // --------------------------------------------------------------------

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return BASE_URI;
    }

    // --------------------------------------------------------------------

    function updateURI(string memory _newURI) external onlyOwner {
        BASE_URI = _newURI;
    }

    // --------------------------------------------------------------------
    
    function mint() external payable whenNotPaused nonReentrant returns (uint256) {
        require(!nftOwners[msg.sender], "CornFi NFT: User can only mint once");

        require(msg.value == TREASURY_FEE.add(DEV_FEE), "CornFi NFT: Invalid fee amount");

        (bool successT, ) = TREASURY_ADDRESS.call{value: TREASURY_FEE}("");
        (bool successD, ) = DEV_ADDRESS.call{value: DEV_FEE}("");

        require(successT && successD, "CornFi NFT: ETH transfer failed");

        // Mint NFT to buyer
        _safeMint(msg.sender, totalSupply);

        nftOwners[msg.sender] = true;

        require(totalSupply < MAX_SUPPLY, "CornFi NFT: Max supply reached");

        return totalSupply++;
    }

    // --------------------------------------------------------------------

    function pause() external onlyOwner {
        _pause();
    }

    // --------------------------------------------------------------------

    function unpause() external onlyOwner {
        _unpause();
    }
}