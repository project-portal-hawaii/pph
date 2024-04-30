import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Alert, Card, Col, Container, Row } from 'react-bootstrap';
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
    <Container id={PageIDs.signUpPage}>
      <Row className="signup-main-image my-3 justify-content-center">
        <Col xs={8} className="text-white py-5 d-flex flex-column justify-content-center">
          <div className="text-center signup-text py-2 px-4">
            <h1>Welcome Back</h1>
            <hr />
          </div>
        </Col>
        <Col xs={4} className="d-flex flex-column justify-content-center py-4">
          <AutoForm schema={bridge} onSubmit={data => submit(data)}>
            <Card className="justify-content-center signup-card">
              <Card.Body id={ComponentIDs.signUpCardBody} className="signup-card-body mb-0">
                <h4>Create a new account</h4>
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
    </Container>
  );
};


export default SignIn;
