// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

contract Migrations {
    address public owner = msg.sender;
    uint public last_completed_migration;

    modifier onlyOwner() {
        require(
        msg.sender == owner,
        "This function is restricted to the contract's owner"
        );
        _;
    }

    function buyProperty() public payable{
    }

    function sellProperty(uint propertyId) public {
    }

    function getPropertiesOwnedByUser(address userAddress) public {
    }

    function transferOwnership(address from, uint propertyId, address to) internal {
    }

    function verifyPropertyOwnership(uint propertyId, address userAddress) public returns(bool){
    }

    function shareOwnership() public {
    }
}
