import React, { useState, useEffect } from "react";
import styled from 'styled-components';
import { Box, Image } from 'react-bulma-components';
import SmartProperty from '../abis/SmartProperty.json';
import ContractEstate from '../abis/ContractEstate.json';


const Title = styled.h2({
  color: "#242424",
  fontWeight: "bold",
  fontSize: "1.4rem",
  marginTop: "0.3rem"
});

const Details = styled.h5({
  color: "#292A2D"
});

const ItemThumb = ({metadataUri, listingId}) => {
  const [title, setTitle] = useState(`Loading...`);
  const [location, setLocation] = useState(`Loading...`);
  const [price, setPrice] = useState(`Loading...`);
  const [description, setDescription] = useState(`Loading...`);
  const [propertySize, setPropertySize] = useState(`Loading...`);
  const [imageUrl, setImageUrl] = useState(`/`);

  const [account, setBuyerAccount] = useState('');
  const [smartPropertyMarket, setSmartPropertyMarketInstance] = useState({});

  const [nftAddress, setNftAddress] = useState('');
  const [marketAddress, setMarketAddress] = useState('');

  const getMetadata = async () => {
    try {
      const res = await fetch(metadataUri);
      const metadata = await res.json();
      setTitle(metadata.deed);
      setLocation(metadata.location);
      setDescription(metadata.description);
      setPropertySize(metadata.propertySize);
      setPrice(window.web3.utils.fromWei(metadata.price, 'Ether'));
      setImageUrl(`${metadata.image}`);

    } catch (err) {
      console.log(err)
    }
  }

  const loadBlockchainData = async () =>{

    const web3 = window.web3

    const accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();

    const smartPropertyMarketData = SmartProperty.networks[networkId];
    const contractEstateData = ContractEstate.networks[networkId];
    const smartPropertyMarketTemp = new web3.eth.Contract(SmartProperty.abi, smartPropertyMarketData.address);

    setBuyerAccount(accounts[0]);
    setSmartPropertyMarketInstance(smartPropertyMarketTemp);
    setNftAddress(contractEstateData.address);
    setMarketAddress(smartPropertyMarketData.address);
  }

  useEffect(() => {
    getMetadata();
    loadBlockchainData();
  }, [getMetadata, loadBlockchainData]);

  return (
      <Box>
        <Image 
          src={`${imageUrl}`}
          style={{"minWidth": "100%", }}
        />
        <Title>Deed Number: {title}</Title>
        <Details><strong>Location: </strong> {location}</Details>
        <Details><strong>Property Size: </strong> {propertySize} m<sup>2</sup></Details>
        <Details><strong>Price: </strong> {price} ETH</Details>
        <Details><strong>Description: </strong> {description}</Details>
        <br/>
        <Details><strong>Verified</strong> </Details>
        <br/>
        <button type="submit" className="btn btn-warning btn-block btn-lg" onClick={async (event)  => {
              event.preventDefault()

              alert("You are about to make a purchase.");
            try{
              await smartPropertyMarket.methods.sellPropertytoBuyer(listingId,  marketAddress).send({ from: account, value: window.web3.utils.toWei(price, 'Ether') });
            }catch (e) {
              console.log("error making a purchase", e);
            } 
          }}>Buy Property</button>
      </Box>
  );
};

export default ItemThumb;
