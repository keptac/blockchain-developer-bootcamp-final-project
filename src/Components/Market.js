import React, { useState, useEffect } from "react";
import ItemThumb from './ItemThumb';
import { Columns } from 'react-bulma-components';

const Market = ({contract, propertyNft, ipfsGateway, limit}) => {
  const [metadataUrl, setMetadataUrl] = useState(`Loading...`);
  const [marketProperties, setMarketProperties] = useState([]);

  const times = n => f => {
    let iter = i => {
      if (i === n) return
      f (i)
      iter (i + 1)
    }
    return iter (0)
  }

  const getSupply = async () => {
    try {
      const smartPropertyMarketContract = contract;
      const estateContractNft = propertyNft;

      const allProperties = await smartPropertyMarketContract.getAvailableProperties();
      
      times (allProperties.length) (async (i) => {
        const tokenId = allProperties[i].deedNumber;

        const metadataUri = await estateContractNft.tokenURI(tokenId);

        const newItem = (
          <Columns.Column key={i}>
            <ItemThumb metadataUri={metadataUri} ipfsGateway={ipfsGateway} />
          </Columns.Column>
        );

        setMarketProperties((prev) => {
          return [...prev, newItem];
        });
  
        setMetadataUrl(metadataUrl);
      });

    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getSupply();
  }, []);

  return (
    <Columns>
      {marketProperties}
    </Columns>
  );
};

export default Market;
