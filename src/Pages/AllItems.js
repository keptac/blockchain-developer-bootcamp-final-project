import { Columns, Heading, Section,  } from 'react-bulma-components';

import Hero from '../Components/Hero';
import Market from '../Components/Market';

import { Link } from "react-router-dom";

const AllItems = ({contract,propertyNft, ipfsGateway}) => {
  return (
    <Section>
      <Hero />
      <Heading size={5} renderAs="h1">All Items</Heading>
      <Columns>
        <Market contract={contract} propertyNft={propertyNft} ipfsGateway={ipfsGateway} />
      </Columns>
      <p>Want to get your art listed? <Link to="/contact">Get in touch</Link>.</p>
    </Section>
  );
};

export default AllItems;