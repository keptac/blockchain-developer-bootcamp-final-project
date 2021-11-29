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
      console.log(this)
      await this.getSupply();
    }

    constructor(props) {
      super(props)
      this.state = {
        account:'',
        metadataUrl: 'loading...',
        marketProperties:[(
          <Columns.Column >
            <ItemThumb metadataUri={'https://ipfs.io/societychain/ipfs/QmdV8XAutRJqrXRo99AYgNcX9iG7zvSHf7C27ZsBQh6xp6?filename=1oexpression-of-interest-for-mining-proposal.pdf'} ipfsGateway={this.props.ipfsGateway} />
          </Columns.Column>
        )]
      }
    }

  async getSupply() {
    
    try {
      const smartPropertyMarketContract = this.props.contract;
      const estateContractNft = this.props.propertyNft;
      // let allProperties = await smartPropertyMarketContract.methods.getAvailableProperties().send({from:this.state.account})
      
      let allProperties = await smartPropertyMarketContract.methods.getAvailableProperties().call()
      console.log("------ ALL PROPERTIES ------>>>>>>>>");
      console.log(allProperties);

        allProperties.forEach(async property => {
          const tokenId = property.deedNumber;

          const metadataUri = await estateContractNft.tokenURI(tokenId);
  
          const newItem = (
            <Columns.Column key={property.propertyListingId}>
              <ItemThumb metadataUri={metadataUri} ipfsGateway={this.props.ipfsGateway} />
            </Columns.Column>
          );
  
          this.setState({marketProperties:this.state.marketProperties.push(newItem)})
          this.setState({metadataURI: metadataUri})
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
