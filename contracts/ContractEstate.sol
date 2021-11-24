// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract ContractEstate is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private deedNumber;

    address contractAddress;

    address payable public _owner;
    mapping(uint256 => PropertyNft) private propertyNftData;

    struct PropertyNft {
        uint256 deedNumber;
        address  owner;
        string tokenUri;
        uint256 price;
    }

    constructor(address marketplaceAddress)  ERC721("ESTATE CONTRACT CHAIN", "ECC") {
        _owner = payable(msg.sender);
        contractAddress = marketplaceAddress;
    }

    /// @notice Mints a new property NFT token
    /// @param tokenLink is the ipfs URI for the NFT
    /// @param _price is the property Value. Its passed by the caller from the ipfs metadata
    /// @param _deed is the deed number to identify the Property (TokenID). Its passed by the caller. Its a from the ipfs metadata
    /// @return uint256 The deed  of the minted NFT
    function createPropertyNft( string memory tokenLink, uint256 _price, uint256 _deed)
        public onlyOwner
        returns (uint256)
    {

        _safeMint(msg.sender, _deed);
        _setTokenURI(_deed, tokenLink);
        setApprovalForAll(contractAddress, true);

        propertyNftData[_deed] = PropertyNft(_deed, msg.sender, tokenLink, _price); //get price from ipfs

        return _deed;
    }
}