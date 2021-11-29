import React, { Component } from 'react';
import { Navbar } from 'react-bulma-components';
import styled from 'styled-components';

import {
  Link
} from "react-router-dom";

const StyledLink = styled(Link)`
  color: #4a4a4a;
`;

// const Navigation = () => {
  class Navigation extends Component {

    render() {
  return (
      <Navbar
        active={true}
        transparent={false}
      >
      <Navbar.Brand>
        {/* <Navbar.Item renderAs="span"> */}
          <Link to="/">
            <img src="logo-sample.png" alt="Contract Estate" width="112" height="150" />
          </Link>
        {/* </Navbar.Item> */}
        <Navbar.Burger />
      </Navbar.Brand>
      <Navbar.Menu >
        <Navbar.Container>
          <Navbar.Item renderAs="span">
            <StyledLink to="/">
              Property Market Place
            </StyledLink>
          </Navbar.Item>
          <Navbar.Item renderAs="span">
            <StyledLink to="/">
              Sell Property
            </StyledLink>
          </Navbar.Item>
          <Navbar.Item renderAs="span">
            <StyledLink to="/">
              Verify Ownership
            </StyledLink>
          </Navbar.Item>
        </Navbar.Container>
      </Navbar.Menu>
    </Navbar>
  );}
};

export default Navigation;