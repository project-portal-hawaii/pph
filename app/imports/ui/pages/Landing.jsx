import React from 'react';
import { Col, Container, Image, Row } from 'react-bootstrap';
import { PageIDs } from '../utilities/ids';

/* A simple static component to render some text for the landing page. */
const Landing = () => (
  <div id={PageIDs.landingPage}>
    <div className="landing-green-background">
      <Container className="text-center">
        <h1 style={{ paddingTop: '20px', color: 'white', fontSize: '36pt' }}>
          Welcome to Project Portal Hawaii!
        </h1>
        <h4 style={{ paddingBottom: '20px', color: 'white' }}>
          Sign up or sign in to view projects posted by members of the community or propose a project of your own!
        </h4>
      </Container>
    </div>
    <div className="landing-white-background">
      <Container className="justify-content-center text-center">
        <h5 style={{ color: '#376551' }}>Once you have signed up and created a profile, you will have access to all parts of the website.</h5>
        <h4 style={{ paddingBottom: '20px', color: '#376551' }}>Registration and Log-in pages:</h4>
        <Row md={1} lg={2}>
          <Col xs={6}>
            <Image src="/images/sign-up.png" width={500} style={{ border: '5px solid black' }} />
          </Col>
          <Col xs={6}>
            <Image src="/images/sign-in.png" width={500} style={{ border: '5px solid black' }} />
          </Col>
        </Row>
      </Container>
    </div>
    <div className="landing-white-background">
      <Container className="justify-content-center text-center">
        <h4 style={{ paddingBottom: '20px', color: '#376551' }}>Edit profile and Add Project pages:</h4>
        <Row md={1} lg={2}>
          <Col xs={6}>
            <Image src="/images/edit-profile.png" width={500} style={{ border: '5px solid black' }} />
          </Col>
          <Col xs={6}>
            <Image src="/images/add-project.png" width={500} style={{ border: '5px solid black' }} />
          </Col>
        </Row>
      </Container>
    </div>
    <div className="landing-white-background text-center">
      <h4 style={{ paddingBottom: '20px', color: '#376551' }}>View all available projects, or view a random one:</h4>
      <Container>
        <Row md={1} lg={2} style={{ paddingBottom: '20px' }}>
          <Col xs={6}>
            <Image src="/images/available-projects.png" width={500} style={{ border: '5px solid black' }} />
          </Col>
          <Col xs={6}>
            <Image src="/images/single-project.png" width={500} style={{ border: '5px solid black' }} />
          </Col>
        </Row>
      </Container>
    </div>
  </div>
);

export default Landing;
