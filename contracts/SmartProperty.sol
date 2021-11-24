// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ContractEstate.sol";

/// @title SmartProperty
/// @author Kelvin Chelenje
/// @dev This contract is used to list new properties on to the Real Estate NFT Market
/// @dev _propertyListingId is an auto incremental id to identify the position on the market place
/// @dev Uses Counters library for tracking properties deeds for properties listed and number of properties Sold.
contract SmartProperty is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _propertyListingId;
    Counters.Counter private _propertiesSold;

    ContractEstate public contractEastateNft;

    address payable buyer;
    mapping(uint256 => Property) private propertyData;

    constructor() {
        buyer = payable(msg.sender);
    }

    struct Property {
        uint256 propertyListingId;
        uint256 propertyValue;
        bool sold;
        uint256 deedNumber;
        address payable seller;
        address payable buyer;
    }

    event PropertyListed (
        uint256 indexed propertyListingId,
        uint256 indexed deedNumber,
        address seller,
        address buyer,
        uint256 propertyValue,
        bool sold
    );

    event Purchase(address seller, address buyer, uint256 price, uint256 deed);

    /// @notice lists a seller's property on the real estate market
    /// @dev transfers the property from seller(buyer) to the Smart Property Contract
    /// @dev first checks if the property is not listed already by checking the deedNumber
    /// @param deedNumber Token ID of the Property
    /// @param propertyValue Price of the Property specified by the seller
    function listPropertyOnEstateMarket(
        uint256 deedNumber, 
        uint256 propertyValue) 
        public payable nonReentrant {
        
        // Add a requirement to check the NFT Meta data owner with msg.sender
        require(propertyValue > 0, "Price must be greater than 0");

        uint256 propertyListingId = _propertyListingId.current();

        propertyData[propertyListingId] = Property(
            propertyListingId,
            propertyValue,
            false,
            deedNumber,
            payable(msg.sender),
            payable(address(0))
        );

        contractEastateNft.safeTransferFrom(msg.sender, address(this), deedNumber);

        _propertyListingId.increment();

        emit PropertyListed(
            propertyListingId,
            deedNumber,
            msg.sender,
            address(0),
            propertyValue,
            false
        );
    }
    /// @dev Transfer the property value amount from the buyer to the seller of the property.
    /// @dev Transfers the deeds from the Smart Property contract to the buyer
    /// @param propertyListingId Listing ID of the property on the real estate market place
    function sellPropertytoBuyer(
        uint256 propertyListingId
        ) public payable nonReentrant {

        uint256 deedNumber = propertyData[propertyListingId].deedNumber;
        uint256 propertyValue = propertyData[propertyListingId].propertyValue;

        require(contractEastateNft._exists(deedNumber), "Error, Property not found");
        require(!propertyData[propertyListingId].sold, "Purchase failed, property is not for sale");
        require(msg.value == propertyValue, "Value entered is below property value of "+propertyValue+". Please submit the price required in order to buy this property.");

        (bool success, ) = propertyData[propertyListingId].seller.call{value: msg.value}("");
        require(success, "Transfer failed");

        contractEastateNft.safeTransferFrom(address(this), msg.sender, deedNumber);

        propertyData[propertyListingId].buyer = payable(msg.sender);
        propertyData[propertyListingId].sold = true;
        _propertiesSold.increment();

        emit Purchase(propertyData[propertyListingId].seller, msg.sender, msg.value, deedNumber);
    }


    ///@notice check if the customer is the true owner of a property
    function verifyPropertyOwnership(uint propertyListingId, address userAddress) public view returns(bool){
        if (propertyData[propertyListingId].buyer == userAddress){
            return true;
        }
    }

    /// @notice Returns the details of the properties owned by the customer
    /// @return Property[] All the properties owned by the customer
    function getPropertiesOwnedByCustomer() public view returns(Property[] memory) {
        uint propertyCount = _propertyListingId.current();
        uint numberOfProperties = 0;
        uint currentIndex = 0;

        for (uint i = 0; i < propertyCount; i++) {
            if (propertyData[i].buyer == msg.sender) {
                numberOfProperties += 1;
            }
        }

        Property[] memory customerProperties = new Property[](numberOfProperties);

        for (uint i = 0; i < totalItemCount; i++) {
            if (propertyData[i].buyer == msg.sender) {
                uint currentId = i;
                // Property storage currentItem = propertyData[currentId];
                customerProperties[currentIndex] = propertyData[currentId];
                currentIndex += 1;
            }
        }

        return customerProperties;
    }

    /// @notice Finds all available properties. i.e properties still available for buying.
    /// @return Property[] All the unsold marketplace properties
    function getAvailableProperties() public view returns(Property[] memory) {
        uint256 numberOfProperties = _propertyListingId.current();
        uint256 numberOfAvailableProperties = _propertyListingId.current() - _propertiesSold.current();
        uint256 currentIndex = 0;

        Property[] memory availableProperties = new Property[](numberOfAvailableProperties);
        
        for(uint256 i = 0; i < numberOfProperties; i++) {
            if (propertyData[i].buyer == address(0)) {
                uint256 currentId = i;
                Property storage currentItem = propertyData[currentId];
                availableProperties[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return availableProperties;
    }

    ///@notice check if the customer is the true owner of a property
    ///@param propertyListingId is the property ID on the market
    ///@param userAddress is the current owner of the property
    ///@return bool if the userAddress is the owner of the properties
    function verifyPropertyOwnership(uint propertyListingId, address userAddress) public view returns(bool){
        if (propertyData[propertyListingId].buyer == userAddress){
            return true;
        }
    }

    /// @notice Finds a property by listing ID
    /// @param propertyListingId ID of the property to be fetched
    /// @return Property Details
    function findPropertyById(uint256 propertyListingId) public view returns(Property memory) {
        return propertyData[propertyListingId];
    }

    /// @notice Finds a property by listing deed number
    /// @param deedNumber property deed
    /// @return Property Details
    function findPropertyByDeed(uint256 deedNumber) public view returns(Property memory) {
        uint positionIndex;
        for (uint i = 0; i < propertyCount; i++) {
            if (propertyData[i].deedNumber == deedNumber) {
                positionIndex = i;
            }
        }
        require(positionIndex>=0);
        return propertyData[positionIndex];
    }

    ///@dev receive() and fallback() functions to allow the contract to receive ETH and data  
    receive() external payable {
    }

    fallback() external payable {
    }
}