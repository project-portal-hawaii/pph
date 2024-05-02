import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Alert, Card, Col, Row, Image } from 'react-bootstrap';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, ErrorsField, SubmitField, TextField } from 'uniforms-bootstrap5';
import { ComponentIDs, PageIDs } from '../utilities/ids';

/*
 * Signin page overrides the form’s submit event and call Meteor’s loginWithPassword().
 * Authentication errors modify the component’s state to be displayed
 */
const SignIn = () => {
  const [error, setError] = useState('');
  const [redirect, setRedirect] = useState(false);
  const schema = new SimpleSchema({
    email: String,
    password: String,
  });
  const bridge = new SimpleSchema2Bridge(schema);

  // Handle Signin submission using Meteor's account mechanism.
  const submit = (doc) => {
    // console.log('submit', doc, redirect);
    const { email, password } = doc;
    Meteor.loginWithPassword(email, password, (err) => {
      if (err) {
        setError(err.reason);
      } else {
        setRedirect(true);
      }
    });
    // console.log('submit2', email, password, error, redirect);
  };

  // Render the signin form.
  // console.log('render', error, redirect);
  // if correct authentication, redirect to page instead of login screen
  if (redirect) {
    return (<Navigate to="/availableprojects" />);
  }
  // Otherwise return the Login form.
  return (
    <Row id={PageIDs.signInPage} className="signin-main-image my-3 justify-content-center">
      <Col xs={8} className="text-white py-5 d-flex flex-column justify-content-center">
        <div className="text-center signin-text">
          <h1>Welcome Back</h1>
          <hr className="my-4" />
          <Image src="/images/logo.png" width={250} className="pt-4" />
        </div>
      </Col>
      <Col xs={4} className="d-flex flex-column justify-content-center">
        <AutoForm schema={bridge} onSubmit={data => submit(data)}>
          <Card className="justify-content-center signin-card my-5 py-5">
            <Card.Body id={ComponentIDs.signInCardBody} className="signin-card-body mb-0">
              <h4>Login</h4>
              <TextField id={ComponentIDs.signInFormEmail} name="email" placeholder="E-mail address" className="pt-4" />
              <TextField id={ComponentIDs.signInFormPassword} name="password" placeholder="Password" type="password" className="pt-2" />
              <ErrorsField />
              <SubmitField id={ComponentIDs.signInFormSubmit} className="py-4" />
              <Alert id={ComponentIDs.signInFormAlert} className="signin-alert-text">
                Need an account? Sign up
                {' '}
                <Link to="/signin">here</Link>
              </Alert>
              {error === '' ? (
                ''
              ) : (
                <Alert variant="danger">
                  <Alert.Heading>Login was not successful</Alert.Heading>
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

export default SignIn;
