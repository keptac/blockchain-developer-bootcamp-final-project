import React, { Component } from 'react';
import { Columns, Hero, Image, Section } from 'react-bulma-components';

import {
  useParams
} from "react-router-dom";

// const ItemView = ({ipfsGateway}) => {
  class ItemView extends Component {

    render() {
  let { itemId } = useParams();

  return (
    <Section>
      <Hero />
      <Columns>
        <Image 
          src={`${this.props.ipfsGateway}/${itemId}`}
        />
      </Columns>
    </Section>
  );}
};

export default ItemView;