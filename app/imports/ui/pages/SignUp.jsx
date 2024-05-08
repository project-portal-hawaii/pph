import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Link, Navigate } from 'react-router-dom';
import { Accounts } from 'meteor/accounts-base';
import { Alert, Card, Col, Row } from 'react-bootstrap';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, ErrorsField, SubmitField, TextField } from 'uniforms-bootstrap5';
import { ComponentIDs, PageIDs } from '../utilities/ids';
import { addProfileMethod } from '../../startup/both/Methods';

/** Defines a new user and associated profile. Error if user already exists. */
/*
 * SignUp component is similar to sign-in component, but we create a new user instead.
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
        Meteor.call(addProfileMethod, { email }, (err1) => {
          if (err1) {
            setError(err1.message);
          } else {
            setError('');
            setRedirectToRef(true);
          }
        });
      }
    });
  };

  // if correct authentication, redirect to from: page instead of signup screen
  if (redirectToReferer) {
    return (<Navigate to="/editprofile" />);
  }
  return (
    <Row id={PageIDs.signUpPage} className="signup-main-image justify-content-center">
      <Col xs={8} className="text-white py-5 d-flex flex-column justify-content-center">
        <div className="text-center signup-text py-2 px-4">
          <h1>Ready to Create?</h1>
          <hr />
          <h5>Sign up and find a new project<br /> to build upon your skills</h5>
        </div>
      </Col>
      <Col xs={4} className="d-flex flex-column justify-content-center py-4">
        <AutoForm schema={bridge} onSubmit={data => submit(data)}>
          <Card className="justify-content-center signup-card">
            <Card.Body id={ComponentIDs.signUpCardBody} className="signup-card-body mb-0">
              <h4>Register</h4>
              <TextField id={ComponentIDs.signUpFormEmail} name="email" placeholder="E-mail address" className="pt-4" />
              <TextField id={ComponentIDs.signUpFormPassword} name="password" placeholder="Password" type="password" className="pt-2" />
              <ErrorsField />
              <SubmitField id={ComponentIDs.signUpFormSubmit} className="pt-4" />
              <Alert id={ComponentIDs.signUpFormAlert} className="signup-alert-text">
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
            </Card.Body>
          </Card>
        </AutoForm>
      </Col>
    </Row>
  );
};

export default SignUp;
