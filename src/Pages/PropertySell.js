import React, { Component } from 'react';
import SmartProperty from '../abis/SmartProperty.json';
import ContractEstate from '../abis/ContractEstate.json';
import Loader from 'react-loader-spinner';

import styled from 'styled-components';
import {
  Link
} from "react-router-dom";

const StyledLink = styled(Link)`
  color: #4a4a4a;
`;

const { create } = require("ipfs-http-client");

const client = create("https://ipfs.infura.io:5001/api/v0");

  class PropertySell extends Component {
    async componentDidMount() {
      await this.loadBlockchainData()
      await this.getMyProperties()
    }

    async loadBlockchainData() {
      
      const web3 = window.web3

      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();

      const smartPropertyMarketData = SmartProperty.networks[networkId];
      const contractEstateData = ContractEstate.networks[networkId];
      const smartPropertyMarket = new web3.eth.Contract(SmartProperty.abi, smartPropertyMarketData.address);
      const contractEstate = new web3.eth.Contract(ContractEstate.abi, contractEstateData.address);

      this.setState({ account: accounts[0] });
      this.setState({ smartPropertyMarket });
      this.setState({ contractEstate });
      this.setState({ marketAddress: smartPropertyMarketData.address});
      this.setState({ contractAddress: contractEstateData.address});
      this.setState({ipfsGateway: `https://ipfs.infura.io/`});
    }

    onFileChange = event => {
      this.setState({ propertyImage: event.target.files[0] });
    };

    async getMyProperties() {
      try {
        // let allProperties = await this.state.contractEstate.methods.getUserProperties().call()
        let allProperties = await this.state.smartPropertyMarket.methods.getPropertiesOwnedByCustomer().call()
        // let allProperties = await this.state.smartPropertyMarket.methods.getAllProperties().call()
        console.log(allProperties);
        
        let myProperties = [];
          allProperties.forEach(async property => {
            myProperties.push(property);
            this.setState({marketProperties:myProperties})
          });
      } catch (err) {
        console.log(err)
      }
    }
  
    constructor(props) {
      super(props)
      this.state = {
        smartPropertyMarket:{},
        contractEstate:{},
        ipfsGateway:'',
        account:'',
        contractAddress:'',
        marketAddress:'',
        propertyImage: null,
        loadingStatus:0,
        mintingStatus:null,
        txError:null,
        txMessage:'Processing your transactions',
        finalMessage:''
      }
    }
  

    render() {
    return (
      < div className="row">
      <div className="col-md-7">
      <h1 className="col-md-12 distance list-property"><b>List Your New Property For Sale</b></h1>
      <div id="content" className="col-md-12 distance" >
        <div className="card mb-4 " >
              
          <div className="card-body">
          <div  className="distance"></div>
            <form className="mb-3" onSubmit={async (event) => {
                event.preventDefault()

                const imageLocation = this.state.propertyImage;
                const deed = this.deed.value;
                const location = this.location.value.toString();
                const propertySize = this.propertySize.value.toString();
                const description = this.description.value.toString();

                let price = this.price.value.toString();
                price = window.web3.utils.toWei(price, 'Ether');

                this.setState({mintingStatus:0});

                Array.from(event.target).forEach((e) => (e.value = ""));

                this.setState({txMessage:'Uploading files to IPFS'});
                try {
                  
                  const url = await client.add(imageLocation);
                  const uploadedImageUrl = `https://ipfs.infura.io/ipfs/${url.path}`;

                  const metadata = {
                    deed:deed,
                    location: location,
                    description:description,
                    image: uploadedImageUrl,
                    propertySize:propertySize,
                    price:price
                  };

                  const metadataRes = await client.add(JSON.stringify(metadata));
                  const tokenURI = `https://ipfs.infura.io/ipfs/${metadataRes.path}`;
                  this.setState({txMessage:`Minting token ${tokenURI}\n\n ...`});

                  try {
                    await this.state.contractEstate.methods.createPropertyNft(tokenURI, price, deed).send({from:this.state.account}).on('transactionHash', async (hash) => {
                      console.log('Minting :', hash);
                      this.setState({txMessage:'Pending second authorization...'});
                      await this.state.smartPropertyMarket.methods.listPropertyOnEstateMarket(deed, price, this.state.contractAddress ).send({from:this.state.account}).on('transactionHash', async (listingHash) => {
                        console.log('Listing :', listingHash);

                        setTimeout(() => {
             
                          this.setState({loadingStatus:1})
                          this.setState({mintingStatus:1})
                          this.setState({finalMessage:`Property has been uploaded and listed successfully. ${listingHash}`})
                       }, 1000);
                        
                       

                      });
                    });

                  }catch (e) {
                    this.setState({txMessage:'An error occured while minting'});
                    this.setState({finalMessage:'An error occured while minting'})
                    console.log("error uploading to minting NFT ", e);
                  }
                } catch (e) {
                  this.setState({txMessage:'An error occured while uploading files to IPFS'});
                    this.setState({finalMessage:'An error occured while uploading files to IPFS'})
                    console.log("error uploading to IPFS ", e);
                  }
              }}>

          <div className="row mb-4">  
              <div className="input-group col-md-7">
                <input
                  type="file"
                  onChange={this.onFileChange}
                  ref={(imageLocation) => { this.imageLocation = imageLocation }}
                  className="form-control form-control-lg"
                  placeholder="Upload Image"
                  required />
              </div>

              <div className="input-group col-md-5">
                <input
                  type="number"
                  ref={(deed) => { this.deed = deed }}
                  className="form-control form-control-lg"
                  placeholder="Title Deed Number"
                  required />
              </div>
        </div>
              <div className="row mb-4">
                <div className="input-group  col-md-6">
                  <input
                    type="text"
                    ref={(location) => { this.location = location }}
                    className="form-control form-control-lg"
                    placeholder="Location"
                    required />
                </div>
                <div className="input-group col-md-6">
                  <input
                    type="text"
                    ref={(propertySize) => { this.propertySize = propertySize }}
                    className="form-control form-control-lg"
                    placeholder="Area Size (m2) "
                    required />
                </div>
              </div>

              <div className="input-group mb-4">
                <input
                  type="text"
                  ref={(price) => { this.price = price }}
                  className="form-control form-control-lg"
                  placeholder="Price in eth"
                  required />
              </div>

              <div className="input-group mb-4">
                <textarea
                  type="text"
                  ref={(description) => { this.description = description }}
                  className="form-control form-control-lg"
                  placeholder="Property Description"
                  required />
              </div>
              <button type="submit" className="btn btn-warning btn-block btn-lg">Submit</button>
            </form>
          </div>
        </div>

      </div>
      </div>

      <div className="col-md-5">

{this.state.loadingStatus === 0 ? (
					this.state.mintingStatus === 0 ? (
						this.state.txError === null ? (
							<div className='flex flex-col justify-center items-center'>
								<div className='text-lg font-bold mt-16 justify-center center-class'>
									{this.state.txMessage}
								</div>
                <Loader
                    className='flex justify-center items-center pt-12 center-class2'
                    type='TailSpin'
                    color='#6B7280'
                    height={40}
                    width={40}
                  />
							</div>
						) : (
							<div className='justify-center items-center text-lg text-red-600 font-semibold'>
								{this.state.txError}
							</div>
						)
					) : (
						<div></div>
					)
				) : (
					<div className='justify-center items-center center-class '>
						{this.state.finalMessage}
            <StyledLink to="/" className="btn btn-warning btn-block btn-lg">
              View Property in Market Place
            </StyledLink>
					</div>
				)}


        {/* <h1 className="col-md-12 distance list-property"><b>My Properties</b></h1>
        <div id="content" className="col-md-12 distance" >
            <div className="card mb-4" >
              <div className="card-body">
                <div className="distance">
            
                </div>
              </div>
            </div>
        </div> */}
      </div>

      </div>
    );
            }
};

export default PropertySell;