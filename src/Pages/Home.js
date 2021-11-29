import { Columns, Heading, Section,  } from 'react-bulma-components';

import Hero from '../Components/Hero';
import Market from '../Components/Market';

const Home = ({contract, propertyNft, ipfsGateway}) => {

  return (
    <Section>
      <Hero />
      <Heading size={5} renderAs="h1">Properties for sell</Heading>
      <Columns>
        <Market contract={contract} propertyNft={propertyNft} ipfsGateway={ipfsGateway} limit={3} />
      </Columns>
    </Section>
  )
};

export default Home;