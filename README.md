# blockchain-developer-bootcamp-final-project


## ETHEREUM ADDRESS FOR CERTIFICATE 

```
0xd3E762b3502AB36D54D0275Da01680586c5A3488
```

## INTRODUCTION AND CONCEPT

```
NFTs have largely been focused on digital art which by far has gotten so much traction. However, 
recently, they are finding their way and usecases in other sectors too. 

This project aims to explore the use of NFTs in real estate. I will create a Dapp that allows 
anyone, anywhere to purchase a real world/physical property or land located at some 
place on earth and given an NFT that represents the property. The NFT will be the deed 
to the land or property that belongs to the buyer and can be proved. 
Essentialy useful when buying farms, homes, offices, urban or country stands etc. 

This addresses challenges i have witnessed particularly in my Country(Zimbabwe) where some 
real estate agents double allocates or sell the same pierce of land to two or three different 
people(intentionally). The buyers will only realise that when the deeds are out, by then its too late. 
You can only imagine the weight of the dispute.

🚀 The project can be further extended, (in another life), to include things like mortages, 
fractional ownership of land, leases and so forth, as inspiration comes and the imagination 
of great minds around unfolds. Won't it be dreamy!!

```
## PUBLIC URL - FRONTEND

[https://contract-estate.herokuapp.com/](https://contract-estate.herokuapp.com/)
```
NB: If is fails to load the first time and displays a heroku erro, refresh the page.
```

## SCREENCAST

- [https://youtu.be/6bE2mqC_vKg](https://youtu.be/6bE2mqC_vKg)
- [https://vimeo.com/651750305](https://vimeo.com/651750305)

## GETTING STARTED LOCALY

### 1. Local Solidity Spin
```
ASSUMPTION: Local ganache network started

git clone https://github.com/keptac/blockchain-developer-bootcamp-final-project

cd /blockchain-developer-bootcamp-final-project

npm install

truffle test --network ganache_gui

truffle compile

truffle migrate --reset
```
### 2. React Local Spin
```
npm start
opens in browser link: https://localhost:3000
```
## FILE STRUCTURE

```
blockchain-developer-bootcamp-final-project
├── .gitignore
├── truffle-config.js
├── package.json
├── README.md
└──  contracts
	├── ContractEstate.sol
	├── Migrations.sol
	└── SmartProperty.sol
└── migrations
	├── 1_initial_migration.js
	└── 2_deploy_contracts.js
├── public
└── src
	├── abis
	├── Components
	├── Pages
	└── utils
		├── ipfs.js
		└── mint.js
	├── App.js
	├── index.js
	├── ReportWebVitals.js
	└── ...
└── test
	├── 1_contractEstate-test.js
	└── 2_smartProperty-test.js
```

## PROCESS FLOW / CUSTOMER JOURNEY

```
0. During first time visit, the dapp checks for metamask presence and contract deployment on 
selected network. It notifies if the contract is not deployed on the selected network. 
(NETWORKS - Rinkeby, local )

if connected it displays the wallet address the user has connected.
```

### ENLISTING A PROPERTY FOR SALE
```
- 1. Select the Sell property menu option

- 2. Upload property image and enter fill all fields dislayed

- 3. Submit the request. 

NOTES: On submit, the dapp uploads data to ipfs via (ips.infura.io) and returns the CID and 
tokenURI. The NFT is then minted immediately to the seller's address. After it is minted it is 
then enlisted to the market place and appears as sold

- 4. Approve transaction on metamask to mint

- 5. Approve transaction on metamask to list property on the market.

- 6. Navigate to the property Marketplace to view the newly listed property
```

### BUYING A PROPERTY
```
- 1. The landing page diplays the list of properties available for purchase on the market place

- 2. Buy option requests for permision to pay x ETH to the property owner

- 3. On successful payment, property is transfered to the buyer and delisted from the market place. 
```

## DEPENDENCIES AND COMMANDS - INSTRUCTIONS

```
npm install  (installing all dependencies)

truffle test --network ganache_gui (running on port 7545)
truffle test --network ganache_cli (running on port 8545)

truffle compile

truffle migrate --reset 

npm start (running react frontend locally)
```

## ISSUES
- [Github Issues Page](https://github.com/keptac/blockchain-developer-bootcamp-final-project/issues)

## CONTACT
- [Email Developer Kelvin Chelenje](mailto:keptac.dev@gmail.com)
