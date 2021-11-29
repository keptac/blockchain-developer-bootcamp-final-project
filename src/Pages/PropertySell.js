import React, { Component } from 'react';
import SmartProperty from '../abis/SmartProperty.json';
import ContractEstate from '../abis/ContractEstate.json';


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
      this.setState({ipfsGateway: `https://ipfs.io/ipfs`});
    }
  
    constructor(props) {
      super(props)
      this.state = {
        smartPropertyMarket:{},
        contractEstate:{},
        ipfsGateway:'',
        account:'',
        contractAddress:'',
        marketAddress:''

      }
    }
  

    render() {
  
    return (

      <div id="content" className="col-md-12 distance" >
        <div className="card mb-4 card-width" >
          <div className="card-body">
          <div className="input-group-append">
              <div className="input-group-text">
                <img src={'logo-sample.png'} height='32' alt=""/>
              </div>
            </div>
          <div  className="distance"></div>
            <form className="mb-3" onSubmit={async (event) => {
                event.preventDefault()
                let deed;
                let price;
                let tokenURI;

                price = this.price.value.toString();
                deed = this.deed.value;
                tokenURI = this.tokenURI.value.toString();

                price = window.web3.utils.toWei(price, 'Ether')
                
                await this.state.contractEstate.methods.createPropertyNft(tokenURI, price, deed).send({from:this.state.account}).on('transactionHash', async (hash) => {
                  await this.state.smartPropertyMarket.methods.listPropertyOnEstateMarket(deed, price, this.state.marketAddress ).send({from:this.state.account});
                });

                // console.log(_deed);

              }}>
              <div>
                <label className="float-center"><b>Stake Tokens</b></label>
              </div>

       
              <div className="input-group mb-4">
                <input
                  type="text"
                  ref={(tokenURI) => { this.tokenURI = tokenURI }}
                  className="form-control form-control-lg"
                  placeholder="Property Link"
                  required />

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
                <input
                  type="number"
                  ref={(deed) => { this.deed = deed }}
                  className="form-control form-control-lg"
                  placeholder="Title Deed Number"
                  required />
              </div>
              <button type="submit" className="btn btn-primary btn-block btn-lg">Submit</button>
            </form>
            <button
              type="submit"
              className="btn btn-link btn-block btn-sm"
              onClick={(event) => {
                event.preventDefault()
                this.props.unstakeTokens()
              }}>
                UN-STAKE...
              </button>
          </div>
        </div>

      </div>
    );
            }
};

export default PropertySell;