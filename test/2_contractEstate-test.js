const { assert } = require('chai');
var SmartPropertyMarket = artifacts.require("./SmartProperty.sol");
var ContractEstate = artifacts.require("./ContractEstate.sol");

describe('ContractEstate Contract', async () => {
	
	let smartPropertyMarket
	let smartPropertyAddress

	let estatePropertyNft
	let nftContractAddress

	let tokenId


	beforeEach(async () => {
		smartPropertyMarket = await SmartPropertyMarket.new();
		estatePropertyNft = await ContractEstate.new(smartPropertyMarket.address);
		smartPropertyAddress = smartPropertyMarket.address;
		nftContractAddress = estatePropertyNft.address;
	});

	// Tests address for the SmartProperty contract
	it('Market should have an address', async () => {
		assert.notEqual(smartPropertyAddress, 0x0)
		assert.notEqual(smartPropertyAddress, null)
		assert.notEqual(smartPropertyAddress, undefined)
	})


	// Tests address for the ContractEstate contract
	it('NFT Should have an address', async () => {
		assert.notEqual(nftContractAddress, 0x0)
		assert.notEqual(nftContractAddress, null)
		assert.notEqual(nftContractAddress, undefined)
	})

	// Tests name for the token of ContractEstate contract
	it('Should have a name', async () => {
		const name = await estatePropertyNft.name();
		assert.equal(name, 'ESTATE CONTRACT CHAIN');
	})

	// Tests symbol for the token of ContractEstate contract
	it('Should have a symbol', async () => {
		const symbol = await estatePropertyNft.symbol()
		assert.equal(symbol, 'ECC');
	})

	// Tests for NFT minting function of ContractEstate contract passing tokenURI, price and _deed to the NFT
	it('Should be able to mint NFT when all arguments are passed', async () => {
		// Mints a NFT
		await estatePropertyNft.createPropertyNft('https://ipfs.io/societychain/ipfs/QmdV8XAutRJqrXRo99AYgNcX9iG7zvSHf7C27ZsBQh6xp6?filename=1oexpression-of-interest-for-mining-proposal.pdf', 30000000000, 122384).then(function(response){
			tokenId = response.logs[0].args['2']['words'][0];
			assert.equal(tokenId, 122384);
		});
		
		// checks if the nft was actually created and it exists
		await estatePropertyNft.checkIfPropertyExists(tokenId).then(function(response){
			assert.equal(response,  true, 'Minting failed. Minted Property not available');
		});
	})


	// Test for number of NFTs owned by an address
	it('Should be able to return number of NFTs owned by and address', async () => {
		// Mints an NFT twice
		await estatePropertyNft.createPropertyNft('https://ipfs.io/societychain/ipfs/QmdV8XAutRJqrXRo99AYgNcX9iG7zvSHf7C27ZsBQh6xp6?filename=1oexpression-of-interest-for-mining-proposal.pdf', 30000000000, 122384).then(function(){});
		await estatePropertyNft.createPropertyNft('https://ipfs.io/societychain/ipfs/QmdV8XAutRJqrXRo99AYgNcX9iG7zvSHf7C27ZsBQh6xp6?filename=1oexpression-of-interest-for-mining-proosal.pdf', 3000000000, 12384).then(function(){});

		// Returns the array of Properties owned by the address
		let propertiesOwned = await estatePropertyNft.getUserProperties();
		assert.equal(propertiesOwned.length, 2);
	})
})