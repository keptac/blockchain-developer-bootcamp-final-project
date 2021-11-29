const { assert } = require('chai');

var SmartPropertyMarket = artifacts.require("./SmartProperty.sol");
var ContractEstate = artifacts.require("./ContractEstate.sol");

contract('SmartProperty', function(accounts) {

	let propertyValue = 300000;
	let deed = 1202384;

	// Tests contract addresses
	it('should check if Addresses are correct - all contracts should have an address',  async () => {
		await SmartPropertyMarket.deployed().then(async function(smartPropertyMarket) {
			await ContractEstate.deployed(smartPropertyMarket.address).then(async function(estatePropertyNft){
				assert.notEqual(smartPropertyMarket.address, 0x0)
				assert.notEqual(smartPropertyMarket.address, null)
				assert.notEqual(smartPropertyMarket.address, undefined)
		
				assert.notEqual(estatePropertyNft.address, 0x0)
				assert.notEqual(estatePropertyNft.address, null)
				assert.notEqual(estatePropertyNft.address, undefined)
			});
		});
	})

	// Test for listing of a Property onto Marketplace
	it('Should be able to list a property for sale on the SmartProperty Market', async () => {
		await SmartPropertyMarket.deployed({gas:0}).then(async function(smartPropertyMarket) {
			await ContractEstate.deployed(smartPropertyMarket.address).then(async function(estatePropertyNft){
				await estatePropertyNft.createPropertyNft('https://ipfs.io/societychain/ipfs/QmdV8XAutRJqrXRo99AYgNcX9iG7zvSHf7C27ZsBQh6erest-for-mining-proposal.pdf', 600000000, 1292).then(function(){});

				// adds the proprty to the sale
				await smartPropertyMarket.listPropertyOnEstateMarket(1292, 600000000, estatePropertyNft.address);
				// Returns all properties available for purchase
				let items = await smartPropertyMarket.getAvailableProperties();
				assert.equal(items.length, 1);
			});
		});
	})

		// Test for fetchng details of an Eastate Property by propertyListingId 
		it('Should be able to get an Eastate Property by propertyListingId',  async () => {
			await SmartPropertyMarket.deployed().then(async function(smartPropertyMarket) {
				await ContractEstate.deployed(smartPropertyMarket.address).then(async function(estatePropertyNft){
		
					await estatePropertyNft.createPropertyNft('https://ipfs.io/societychain/ipfs/QmdV8XAutRJqrXRo99AYgNcX9iG7zvSHf7C27ZsBQh6xp6?filename=1oexpression-of-interest-for-mining.pdf', propertyValue, 7865).then(function(){});
					await estatePropertyNft.createPropertyNft('https://ipfs.io/societychain/ipfs/QmdV8XAutRJqrXRo99AYgNcX9iG7zvSHf7C27ZsBQh6xp6?filename=1oexpression-of-interest-for-mining-proposal.pdf', propertyValue, 91345221).then(function(){});
					await smartPropertyMarket.listPropertyOnEstateMarket(7865, propertyValue,estatePropertyNft.address);
					await smartPropertyMarket.listPropertyOnEstateMarket(91345221, propertyValue,estatePropertyNft.address);
			
					// Fetches the details of first marketplace item by its propertyListingId
					let property = await smartPropertyMarket.findPropertyById(1);
					assert.equal(property.propertyListingId, 1);
		
				});
			});
		})

	// Test for creation and sale of an Eastate Property
	it('Should be able to buy Eastate Property and transfer it to buyer',  async () => {
		await SmartPropertyMarket.deployed().then(async function(smartPropertyMarket) {
			await ContractEstate.deployed(smartPropertyMarket.address).then(async function(estatePropertyNft){

				let accounts = await web3.eth.getAccounts();
	
				await estatePropertyNft.createPropertyNft('https://ipfs.io/societychain/ipfs/QmdV8XAutRJqrXRo99AYgNcX9iG7zvSHf7C27ZsBQh6xp6?filename=1oexpression-of-interest-for-mining-proposa.pdf',  600000000000000, 0122).then(function(){});
				await estatePropertyNft.createPropertyNft('https://ipfs.io/societychain/ipfs/QmdV8XAutRJqrXRo99AYgNcX9iG7zvSHf7C27ZsBQh6xp6?filename=1oexpression-of-interest-for-mining-proposal.pdf', 6000000000000000, 913221).then(function(){});
				
				await smartPropertyMarket.listPropertyOnEstateMarket(0122, 6000000000000000, estatePropertyNft.address);
				await smartPropertyMarket.listPropertyOnEstateMarket(913221, 6000000000000000, estatePropertyNft.address);
		
				let itemsPresent = await smartPropertyMarket.getAvailableProperties();
				console.log(itemsPresent);
				assert.equal(itemsPresent.length, 5, "Listing Failed. No properties added to the markert place")
		
				// Creates a sale for the first NFT and transfers it from the owner to the buyer through the marketplace contract
				await smartPropertyMarket
					.sellPropertytoBuyer(4, estatePropertyNft.address, { from: accounts[7], value: 6000000000000000 });
				await smartPropertyMarket
					.sellPropertytoBuyer(3, estatePropertyNft.address, { from: accounts[9], value: 6000000000000000 })
		
				// Returns one un purchased property
				let items = await smartPropertyMarket.getAvailableProperties();
				console.log(items)
				assert.equal(items.length, 3, "Purchase failed No property sold to buyer.")
	
			});
		});
	})

})