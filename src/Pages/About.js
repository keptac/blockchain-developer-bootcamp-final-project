import React, { Component } from 'react';
import { Heading, Section,  } from 'react-bulma-components';

import Hero from '../Components/Hero';

// const About = () => {
  class About extends Component {

    render() {
  

  return (
    <Section>
      <Hero />
      <Heading size={5} renderAs="h1">About</Heading>
      <p>Decentralized art is the future of art.</p>
    </Section>
  )}
};

export default About;