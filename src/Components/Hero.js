import React, { Component } from 'react';
import { Container, Heading, Hero } from 'react-bulma-components';
import styled from 'styled-components';

const StyledHero = styled(Hero)`
  margin-bottom: 3rem
`;

// const Welcome = () => {
  class Welcome extends Component {

    render() {
  return (
    <StyledHero color="primary" gradient>

      <Hero.Body>
        <Container>
          <Heading>
            Welcome to Contract Estate - Smart Property
          </Heading>
          <Heading subtitle size={5}>
            Buy and Sell Land and Real estate Properties as NFTs
          </Heading>
        </Container>
      </Hero.Body>
    </StyledHero>
    
  );}
};

export default Welcome;