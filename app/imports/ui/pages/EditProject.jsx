import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { AutoForm } from 'uniforms-bootstrap5';
import swal from 'sweetalert';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { useParams } from 'react-router';
import { useTracker } from 'meteor/react-meteor-data';
import { _ } from 'meteor/underscore';
import { updateProjectMethod } from '../../startup/both/Methods';
import { Interests } from '../../api/interests/Interests';
import { Profiles } from '../../api/profiles/Profiles';
import { ProfilesInterests } from '../../api/profiles/ProfilesInterests';
import { ProfilesProjects } from '../../api/profiles/ProfilesProjects';
import { Projects } from '../../api/projects/Projects';
import { ProjectsStatuses } from '../../api/projects/ProjectsStatuses';
import LoadingSpinner from '../components/LoadingSpinner';
import { pageStyle } from './pageStyles';
import { PageIDs } from '../utilities/ids';
import { Statuses } from '../../api/statuses/Statuses';
import ProjectForm from '../components/ProjectForm';
// import Project from '../components/Project';
// import { ProjectsStatuses } from '../../api/projects/ProjectsStatuses';

/* Create a schema to specify the structure of the data to appear in the form. */
const makeSchema = (allInterests, allParticipants, allStatuses, currentStatuses) => new SimpleSchema({
  name: String,
  description: String,
  homepage: String,
  picture: String,
  interests: { type: Array, label: 'Interests', optional: true },
  'interests.$': { type: String, allowedValues: allInterests },
  participants: { type: Array, label: 'Participants', optional: true },
  'participants.$': { type: String, allowedValues: allParticipants },
  // Added fields after this point
  date: { type: String, optional: false },
  students: { type: String, optional: false },
  video: { type: String, optional: true },
  testimonials: { type: String, optional: true },
  techStack: { type: String, optional: true },
  instructor: { type: String, optional: false, defaultValue: 'Dan Port' },
  image: { type: String, optional: true },
  poster: { type: String, optional: true },
  // Status
  statuses: { type: Array, label: 'Statuses', optional: false, defaultValue: currentStatuses },
  'statuses.$': { type: String, allowedValues: allStatuses },
});

/* Renders the Page for adding a project. */
const EditProject = () => {
  const { _id: projectId } = useParams();
  // console.log(useParams());
  /* On submit, insert the data. */
  const submit = (data) => {
    Meteor.call(updateProjectMethod, data, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        swal('Success', 'Project updated successfully', 'success');
      }
    });
  };

  const { ready, interests, profiles, statuses } = useTracker(() => {
    // Ensure that minimongo is populated with all collections prior to running render().
    const sub1 = Meteor.subscribe(Interests.userPublicationName);
    const sub2 = Meteor.subscribe(Profiles.userPublicationName);
    const sub3 = Meteor.subscribe(ProfilesInterests.userPublicationName);
    const sub4 = Meteor.subscribe(ProfilesProjects.userPublicationName);
    const sub5 = Meteor.subscribe(Projects.userPublicationName);
    const subStatuses = Meteor.subscribe(Statuses.userPublicationName);
    const subCurrentStatuses = Meteor.subscribe(ProjectsStatuses.userPublicationName);
    return {
      ready: sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready() && sub5.ready() && subStatuses.ready() && subCurrentStatuses.ready(),
      interests: Interests.collection.find().fetch(),
      profiles: Profiles.collection.find().fetch(),
      statuses: Statuses.collection.find().fetch(),
    };
  }, []);
  if (ready) {
    const allInterests = _.pluck(interests, 'name');
    const allParticipants = _.pluck(profiles, 'email');
    const allStatuses = _.pluck(statuses, 'name');
    // const projectName = Projects.collection.findOne({ _id: projectId }).name;
    const currentStatuses = []; // [ProjectsStatuses.collection.find({ project: projectName }).fetch()];
    const projectName = Projects.collection.findOne({ _id: projectId }).name;
    ProjectsStatuses.collection.find({ project: projectName }).fetch().map((status) => currentStatuses.push(status.status));
    const formSchema = makeSchema(allInterests, allParticipants, allStatuses, currentStatuses);
    const bridge = new SimpleSchema2Bridge(formSchema);
    const project = Projects.collection.findOne({ _id: projectId });
    const model = _.extend({}, project);
    // const transform = (label) => ` ${label}`;
    /* Render the form. Use Uniforms: https://github.com/vazco/uniforms */
    return (
      <Container style={pageStyle}>
        <Row id={PageIDs.addProjectPage} className="justify-content-center">
          <Col xs={10}>
            <Col className="text-center"><h2>Edit Project</h2></Col>
            <AutoForm model={model} schema={bridge} onSubmit={data => submit(data)}>
              <ProjectForm />
            </AutoForm>
          </Col>
        </Row>
      </Container>
    );
  }
  return <LoadingSpinner />;
};

export default EditProject;
