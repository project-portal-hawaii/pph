import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { AutoForm, ErrorsField, HiddenField, SubmitField, TextField } from 'uniforms-bootstrap5';
import swal from 'sweetalert';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import PropTypes from 'prop-types';
import { Comments } from '../../api/comment/Comments';

// Create a schema to specify the structure of the data to appear in the form.
const formSchema = new SimpleSchema({
  comment: String,
  owner: String,
  projectId: String,
  createdAt: Date,
});

const bridge = new SimpleSchema2Bridge(formSchema);

/* Renders the AddContact page for adding a document. */
const AddComment = ({ owner, projectId }) => {

  // On submit, insert the data.
  const submit = (data, formRef) => {
    const { comment, createdAt } = data;
    Comments.collection.insert(
      { comment, projectId, createdAt, owner },
      (error) => {
        if (error) {
          swal('Error', error.message, 'error');
        } else {
          swal('Success', 'Item added successfully', 'success');
          formRef.reset();
        }
      },
    );
  };

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  let fRef = null;
  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={10}>
          <Col className="text-center"><h4>Add Timestamped Note</h4></Col>
          <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => submit(data, fRef)}>
            <Card>
              <Card.Body>
                <TextField name="comment" />
                <SubmitField />
                <ErrorsField />
                <HiddenField name="owner" value={owner} />
                <HiddenField name="projectId" value={projectId} />
                <HiddenField name="createdAt" value={new Date()} />
              </Card.Body>
            </Card>
          </AutoForm>
        </Col>
      </Row>
    </Container>
  );
};

AddComment.propTypes = {
  owner: PropTypes.string.isRequired,
  projectId: PropTypes.string.isRequired,
};
export default AddComment;
