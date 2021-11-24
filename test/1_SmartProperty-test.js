const { assert } = require('chai');
const {ethers} = require('ethers');

var SmartPropertyMarket = artifacts.require("./SmartProperty.sol");
var ContractEstate = artifacts.require("./ContractEstate.sol");

describe('SmartProperty Contract', function () {

	let smartPropertyMarket;
	let smartPropertyAddress;

	let estatePropertyNft;
	let nftContractAddress;

	let propertyValue;
	let tokenId;
	let deed = 122384;


	beforeEach(async () => {
		smartPropertyMarket = await SmartPropertyMarket.new();
		smartPropertyAddress = smartPropertyMarket.address;

		estatePropertyNft = await ContractEstate.new(smartPropertyMarket.address);
		nftContractAddress = estatePropertyNft.address;

		propertyValue = ethers.utils.parseUnits('0.5', 'ether')
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

	// Test for listing of a Property onto Marketplace
	it('Should be able to list a property for sale on the SmartProperty Market', async () => {
		await estatePropertyNft.createPropertyNft('https://ipfs.io/societychain/ipfs/QmdV8XAutRJqrXRo99AYgNcX9iG7zvSHf7C27ZsBQh6xp6?filename=1oexpression-of-interest-for-mining-proposal.pdf', propertyValue, deed).then(function(){});

		// Puts the NFT up for sale in the eternal marketplace
		await smartPropertyMarket.listPropertyOnEstateMarket(deed, propertyValue)

		// Returns all properties available for purchase
		let items = await smartPropertyMarket.getAvailableProperties()

		console.log(items);

		assert.equal(items.length, 1)
	})

	// Test for creation and sale of an Eternal Marketplace item
	it('Should be able to execute Eternal Item Sale', async () => {
		// Mints 2 NFTs
		await estatePropertyNft.createEternalNFT()
		await estatePropertyNft.createEternalNFT()

		// Puts the first NFT up for sale in the eternal marketplace
		await smartPropertyMarket.createEternalMarketItem(nftContractAddress, 0, propertyValue, {
			value: listingPrice,
		})

		// Puts the second NFT up for sale in the eternal marketplace
		await smartPropertyMarket.createEternalMarketItem(nftContractAddress, 1, propertyValue, {
			value: listingPrice,
		})

		const [_, buyerAddress] = await ethers.getSigners()

		// Creates a sale for the first NFT and transfers it from the owner to the buyer through the marketplace contract
		await smartPropertyMarket
			.connect(buyerAddress)
			.createEternalItemSale(nftContractAddress, 1, { value: propertyValue })

		// Fetches the remaining unsold marketplace items
		// Returns one as one of the two NFT minted is sold
		let items = await smartPropertyMarket.fetchEternalItems()

		assert.equal(items.length, 1)
	})

	// Test for fetchng details of an Eternal Marketplace item using its itemId
	it('Should be able to get an Eternal item by its tokenId', async () => {
		// Mints 2 NFTs
		await estatePropertyNft.createEternalNFT()
		await estatePropertyNft.createEternalNFT()

		// Puts the first NFT up for sale in the eternal marketplace
		await smartPropertyMarket.createEternalMarketItem(nftContractAddress, 0, propertyValue, {
			value: listingPrice,
		})

		// Puts the second NFT up for sale in the eternal marketplace
		await smartPropertyMarket.createEternalMarketItem(nftContractAddress, 1, propertyValue, {
			value: listingPrice,
		})

		// Fetches the details of first marketplace item by its itemId
		let item = await smartPropertyMarket.fetchEternalItemById(1)

		assert.equal(item.itemId, 1)
	})

	// Test for fetchng details of all created Eternal Marketplace items
	it('Should be able to get an Eternal item by its tokenId', async () => {
		// Mints 2 NFTs
		await estatePropertyNft.createEternalNFT()
		await estatePropertyNft.createEternalNFT()

		// Puts the first NFT up for sale in the eternal marketplace
		await smartPropertyMarket.createEternalMarketItem(nftContractAddress, 0, propertyValue, {
			value: listingPrice,
		})

		// Puts the second NFT up for sale in the eternal marketplace
		await smartPropertyMarket.createEternalMarketItem(nftContractAddress, 1, propertyValue, {
			value: listingPrice,
		})

		// Fetches the details of all unsold marketplace items
		// Returs 2 as two eternal items are created and none is sold
		let item = await smartPropertyMarket.fetchEternalItems()

		assert.equal(item.length, 2)
	})
})