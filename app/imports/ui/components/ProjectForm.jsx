import React from 'react';
import Select from 'react-select';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';
import { Card, Col, Row } from 'react-bootstrap';
import { ErrorsField, LongTextField, SubmitField, TextField } from 'uniforms-bootstrap5';
import { ComponentIDs } from '../utilities/ids';

const statusOptions = [
  { value: 'Proposed', label: 'Proposed' },
  { value: 'Published', label: 'Published' },
  { value: 'Showcase', label: 'Showcase' },
];

const ProjectForm = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { currentUser, isAdmin } = useTracker(() => ({
    currentUser: Meteor.user() ? Meteor.user().username : '',
    isAdmin: Roles.userIsInRole(Meteor.userId(), 'admin'),
  }), []);
  return (
    <Card>
      <Card.Body id={ComponentIDs.addProjectCardBody}>
        {(currentUser && isAdmin) ? (<Select id={ComponentIDs.editProjectFormStatus} name="status" options={statusOptions} defaultValue="Proposed" />) : ''}
        <Row>
          <Col xs={4}><TextField id={ComponentIDs.addProjectFormName} name="name" showInlineError placeholder="Project name" /></Col>
          <Col xs={4}><TextField id={ComponentIDs.addProjectFormPicture} name="picture" showInlineError placeholder="Project picture URL" /></Col>
          <Col xs={4}><TextField id={ComponentIDs.addProjectFormHomePage} name="homepage" showInlineError placeholder="Homepage URL" /></Col>
        </Row>
        <LongTextField id={ComponentIDs.addProjectFormDescription} name="description" placeholder="Describe the project here" />
        <TextField id={ComponentIDs.addProjectFormDate} name="date" placeholder="Enter the semester and year" />
        <TextField id={ComponentIDs.addProjectFormStudents} name="students" placeholder="Enter the names of the students" />
        <TextField id={ComponentIDs.addProjectFormVideo} name="video" placeholder="Video URL" />
        <TextField id={ComponentIDs.addProjectFormTestimonials} name="testimonials" placeholder="Enter testimonials" />
        <TextField id={ComponentIDs.addProjectFormTechStack} name="techStack" placeholder="List tech stacks" />
        <TextField id={ComponentIDs.addProjectFormInstructor} name="instructor" placeholder="Enter instructor name" />
        <TextField id={ComponentIDs.addProjectFormImage} name="image" placeholder="Image URL" />
        <TextField id={ComponentIDs.addProjectFormPoster} name="poster" placeholder="Poster URL" />
        {/* // We will want to do something similar to this.
                <Row>
                  <Col xs={6} id={ComponentIDs.addProjectFormInterests}>
                    <SelectField name="interests" showInlineError placeholder="Interests" multiple checkboxes transform={transform} />
                  </Col>
                  <Col xs={6} id={ComponentIDs.addProjectFormParticipants}>
                    <SelectField name="participants" showInlineError placeholder="Participants" multiple checkboxes transform={transform} />
                  </Col>
                </Row> */}
        <SubmitField id={ComponentIDs.addProjectFormSubmit} value="Submit" />
        <ErrorsField />
      </Card.Body>
    </Card>
  );
};

export default ProjectForm;
