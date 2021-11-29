import React, { Component } from 'react';
// import Web3 from 'web3';
import ItemThumb from './ItemThumb';
import { Columns } from 'react-bulma-components';

// const Market = ({contract, propertyNft, ipfsGateway, limit}) => {
  class Market extends Component {
    

    async componentDidMount() {
      
      const web3 = window.web3
      const accounts = await web3.eth.getAccounts()
      this.setState({ account: accounts[0] })
      await this.getSupply();
    }

    constructor(props) {
      super(props)
      this.state = {
        account:'',
        marketProperties:[]
      }
    }

  async getSupply() {
    
    try {
      const smartPropertyMarketContract = this.props.contract;
      const estateContractNft = this.props.propertyNft;
      let allProperties = await smartPropertyMarketContract.methods.getAvailableProperties().call()
      let newProperties = [];

        allProperties.forEach(async property => {
          const tokenId = property.deedNumber;

          const metadataUri = await estateContractNft.methods.tokenURI(tokenId).call();

          
          if(metadataUri!=='http://localhost:3000/logo-sample.png'){
            const newItem = (
              <Columns.Column key={property.propertyListingId}>
                <ItemThumb metadataUri={metadataUri} ipfsGateway={this.props.ipfsGateway} />
              </Columns.Column>
            );
  
             newProperties.push(newItem);
            this.setState({marketProperties:newProperties})
          }

        });
    } catch (err) {
      console.log(err)
    }
  }

  render() {
  return (
    <Columns>
      {this.state.marketProperties}
    </Columns>
  );}
};

export default Market;
