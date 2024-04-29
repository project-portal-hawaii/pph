import React from 'react';
import { TextField, LongTextField, SubmitField } from 'uniforms-bootstrap5';
import { Col, Card, Row } from 'react-bootstrap';
import { ComponentIDs } from '../utilities/ids';

/* Renders the Profile Page: what appears after the user logs in. */
const Profile = () => (
  <Card>
    <Card.Body id={ComponentIDs.editProfileCardBody}>
      <Row>
        <Col xs={4}><TextField id={ComponentIDs.editProfileFormFirstName} name="firstName" showInlineError placeholder="First Name" /></Col>
        <Col xs={4}><TextField id={ComponentIDs.editProfileFormLastName} name="lastName" showInlineError placeholder="Last Name" /></Col>
        <Col xs={4}><TextField name="email" showInlineError placeholder="email" disabled /></Col>
      </Row>
      <LongTextField id={ComponentIDs.editProfileFormBio} name="bio" placeholder="Write a little bit about yourself." />
      <Row>
        <Col xs={6}><TextField name="title" showInlineError placeholder="Title" /></Col>
        <Col xs={6}><TextField name="picture" showInlineError placeholder="URL to picture" /></Col>
      </Row>
      { /* <Row>
          <Col xs={6}><SelectField name="interests" showInlineError multiple /></Col>
          <Col xs={6}><SelectField name="projects" showInlineError multiple /></Col>
        </Row> */}
      <SubmitField id={ComponentIDs.editProfileFormSubmit} value="Update" />
    </Card.Body>
  </Card>
);

export default Profile;
