import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Accounts } from 'meteor/accounts-base';
import { Alert, Card, Col, Container, Image, Row } from 'react-bootstrap';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, ErrorsField, SubmitField, TextField } from 'uniforms-bootstrap5';
import { ComponentIDs, PageIDs } from '../utilities/ids';

/*
 * SignUp component is similar to signin component, but we create a new user instead.
 */
const SignUp = () => {
  const [error, setError] = useState('');
  const [redirectToReferer, setRedirectToRef] = useState(false);

  const schema = new SimpleSchema({
    email: String,
    password: String,
  });
  const bridge = new SimpleSchema2Bridge(schema);

  /* Handle SignUp submission. Create user account and a profile entry, then redirect to the home page. */
  const submit = (doc) => {
    const { email, password } = doc;
    Accounts.createUser({ email, username: email, password }, (err) => {
      if (err) {
        setError(err.reason);
      } else {
        setError('');
        setRedirectToRef(true);
      }
    });
  };

  // if correct authentication, redirect to from: page instead of signup screen
  if (redirectToReferer) {
    return (<Navigate to="/editprofile" />);
  }
  return (
    <Container id={PageIDs.signUpPage} className="signup-main-image">
      <Row className="justify-content-center">
        <Col xs={8} className="text-white py-5 d-flex flex-column justify-content-center">
          <div className="text-center signup-text p-2">
            <h1>Ready to create?</h1>
            <hr />
            <h5>Sign up and find a new project<br /> to build your skills</h5>
          </div>
        </Col>
        <Col xs={4} className="d-flex flex-column justify-content-center align-items-center">
          <AutoForm schema={bridge} onSubmit={data => submit(data)}>
            <Card className="justify-content-center d-flex">
              <Card.Body id={ComponentIDs.signUpCardBody} className="signup-card">
                <h2 style={{ color: '#376551', textAlign: 'center' }}>Create a new account</h2>
                <TextField id={ComponentIDs.signUpFormEmail} name="email" placeholder="E-mail address" />
                <TextField id={ComponentIDs.signUpFormPassword} name="password" placeholder="Password" type="password" />
                <ErrorsField />
                <SubmitField id={ComponentIDs.signUpFormSubmit} />
              </Card.Body>
            </Card>
          </AutoForm>
          <Alert id={ComponentIDs.signUpFormAlert}>
            Already have an account? Login
            {' '}
            <Link to="/signin">here</Link>
          </Alert>
          {error === '' ? (
            ''
          ) : (
            <Alert variant="danger">
              <Alert.Heading>Registration was not successful</Alert.Heading>
              {error}
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default SignUp;
