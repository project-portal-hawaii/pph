import React from 'react';
import { Col, Container } from 'react-bootstrap';

/* The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => (
  <footer className="footer mt-auto py-3 bg-dark">
    <Container>
      <Col className="text-center" style={{ color: 'white' }}>
        Project Portal Hawaiʻi
        {' '}
        <br />
        University of Hawaiʻi at Mānoa
        {' '}
        <br />
        <a style={{ color: 'white' }} href="https://project-portal-hawaii.github.io">https://project-portal-hawaii.github.io</a>
      </Col>
    </Container>
  </footer>
);

export default Footer;
