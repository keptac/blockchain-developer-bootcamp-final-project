import React, { Component } from 'react';
import SmartProperty from '../abis/SmartProperty.json';
import ContractEstate from '../abis/ContractEstate.json';

const { create } = require("ipfs-http-client");

const client = create("https://ipfs.infura.io:5001/api/v0");

  class PropertySell extends Component {
    async componentDidMount() {
      await this.loadBlockchainData()
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
      console.log(event.target.files[0]);
    };
  
    constructor(props) {
      super(props)
      this.state = {
        smartPropertyMarket:{},
        contractEstate:{},
        ipfsGateway:'',
        account:'',
        contractAddress:'',
        marketAddress:'',
        propertyImage: null
      }
    }
  

    render() {
  
    return (
      <div id="content" className="col-md-12 distance" >
        <div className="card mb-4 card-width" >
                <h1><b>List Your Property</b></h1>
          <div className="card-body">
          <div className="input-group-append">
              <div className="input-group-text">
                <img src={'logo-sample.png'} height='200'width='200' alt=""/>
              </div>
            </div>
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

                // Uplodad to ipfs
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

                  // client2.pin.add(metadataRes.path).then((res) => {
                  //   console.log(res)
                  // });

                  try {
                    await this.state.contractEstate.methods.createPropertyNft(tokenURI, price, deed).send({from:this.state.account}).on('transactionHash', async (hash) => {
                      await this.state.smartPropertyMarket.methods.listPropertyOnEstateMarket(deed, price, this.state.marketAddress ).send({from:this.state.account});
                    });
                  
                  }catch (e) {
                    console.log("error uploading to minting NFT", e);
                  }

                  alert("Property has been uploaded and listed successfully. It may take a while to update the listing. Be patient with me");
                  return {
                    uploadedImageUrl,
                    tokenURI,
                    metaDataHashCID: metadataRes.path,
                    imageHashCID: url.path,
                  };
                } catch (e) {
                    console.log("error uploading to IPFS", e);
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
                  type="number"
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

              <button type="submit" className="btn btn-primary btn-block btn-lg">Submit</button>
            </form>
          </div>
        </div>

      </div>
    );
            }
};

export default PropertySell;