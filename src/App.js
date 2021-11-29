import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import 'react-bulma-components/dist/react-bulma-components.min.css';
import { Container } from 'react-bulma-components';
import {
  Switch,
  Route,
} from "react-router-dom";

import { ethers } from "ethers";

import Home from './Pages/Home';
import ItemView from './Pages/ItemView';
import AllItems from './Pages/AllItems';
import Contact from './Pages/Contact';
import About from './Pages/About';

import Navigation from './Components/Navigation';
import Footer from './Components/Footer';

import SmartProperty from './abis/SmartProperty.json';
import ContractEstate from './abis/ContractEstate.json';

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    const networkId = await web3.eth.net.getId()
    const smartPropertyMarketData = SmartProperty.networks[networkId]
    const contractEstateData = ContractEstate.networks[networkId]

    if(smartPropertyMarketData) {
      const smartPropertyMarket = new web3.eth.Contract(SmartProperty.abi, smartPropertyMarketData.address);
      this.setState({ smartPropertyMarket });
    } else {
      window.alert('SmartProperty contract not deployed to detected network.')
    }

    if(contractEstateData) {
      const contractEstate = new web3.eth.Contract(ContractEstate.abi, contractEstateData.address);
      this.setState({ contractEstate });
    } else {
      window.alert('ContractEstate NFT not deployed to detected network.')
    }

    this.setState({ipfsGateway: `https://ipfs.io/ipfs`});
    this.setState({ loading: false })
  }

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      smartPropertyMarket:{},
      contractEstate:{},
      ipfsGateway:''
    }
  }

  render() {
    let content
    if(this.state.loading) {
      content = <p id="loader" className="text-center">Loading...</p>
    } else {
      content = <Container>
      <Switch>
        <Route path="/" exact>
          <Navigation />
            <Home contract={this.state.smartPropertyMarket} propertyNft={this.state.contractEstate} ipfsGateway={this.state.ipfsGateway} />
          <Footer />
        </Route>
        <Route path="/item/:itemId">
          <Navigation />
            <ItemView ipfsGateway={this.state.ipfsGateway} />
          <Footer />
        </Route>
        <Route path="/contact">
          <Navigation />
            <Contact />
          <Footer />
        </Route>
        <Route path="/about">
          <Navigation />
            <About />
          <Footer />
        </Route>
        <Route path="/all">
          <Navigation />
            <AllItems contract={this.state.smartPropertyMarket} propertyNft={this.state.contractEstate} ipfsGateway={this.state.ipfsGateway} />
          <Footer />
        </Route>
      </Switch>
    </Container>
    }

    return (content);
  }
}

export default App;
