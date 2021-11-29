import React, { Component } from 'react';
import { Container, Heading, Hero } from 'react-bulma-components';
import styled from 'styled-components';

const StyledHero = styled(Hero)`
  margin-bottom: 1rem
`;

// const Welcome = () => {
  class Welcome extends Component {

    render() {
  return (
    <StyledHero color="primary" gradient>
      <Hero.Body>
        <Container>
          <Heading>
            Filecoin Gallery
          </Heading>
          <Heading subtitle size={5}>
            Explore the world of decentrally stored art
          </Heading>
        </Container>
      </Hero.Body>
    </StyledHero>
  );}
};

export default Welcome;