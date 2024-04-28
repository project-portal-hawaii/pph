import React from 'react';
import { AutoForm } from 'uniforms-bootstrap5';
import { Container, Col } from 'react-bootstrap';
import swal from 'sweetalert';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { _ } from 'meteor/underscore';
import { useTracker } from 'meteor/react-meteor-data';
import { Interests } from '../../api/interests/Interests';
import { Profiles } from '../../api/profiles/Profiles';
import { ProfilesInterests } from '../../api/profiles/ProfilesInterests';
import { ProfilesProjects } from '../../api/profiles/ProfilesProjects';
import { Projects } from '../../api/projects/Projects';
import { updateProfileMethod } from '../../startup/both/Methods';
import LoadingSpinner from '../components/LoadingSpinner';
import { pageStyle } from './pageStyles';
import { PageIDs } from '../utilities/ids';

/* Create a schema to specify the structure of the data to appear in the form. */
const makeSchema = (allInterests, allProjects) => new SimpleSchema({
  email: { type: String, label: 'Email', optional: true },
  firstName: { type: String, label: 'First', optional: true },
  lastName: { type: String, label: 'Last', optional: true },
  bio: { type: String, label: 'Biographical statement', optional: true },
  title: { type: String, label: 'Title', optional: true },
  picture: { type: String, label: 'Picture URL', optional: true },
  interests: { type: Array, label: 'Interests', optional: true },
  'interests.$': { type: String, allowedValues: allInterests },
  projects: { type: Array, label: 'Projects', optional: true },
  'projects.$': { type: String, allowedValues: allProjects },
  roleAdmin: { type: Boolean },
});
/* Renders the Profile Page: what appears after the user logs in. */
const EditProfile = () => {

  /* On submit, insert the data. */
  const submit = (data) => {
    Meteor.call(updateProfileMethod, data, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        swal('Success', 'Profile updated successfully', 'success');
      }
    });
  };

  const { ready, email } = useTracker(() => {
    // Ensure that minimongo is populated with all collections prior to running render().
    const sub1 = Meteor.subscribe(Interests.userPublicationName);
    const sub2 = Meteor.subscribe(Profiles.userPublicationName);
    const sub3 = Meteor.subscribe(ProfilesInterests.userPublicationName);
    const sub4 = Meteor.subscribe(ProfilesProjects.userPublicationName);
    const sub5 = Meteor.subscribe(Projects.userPublicationName);
    return {
      ready: sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready() && sub5.ready(),
      email: Meteor.user()?.username,
    };
  }, []);
  // Create the form schema for uniforms. Need to determine all interests and projects for muliselect list.
  const allInterests = _.pluck(Interests.collection.find().fetch(), 'name');
  const allProjects = _.pluck(Projects.collection.find().fetch(), 'name');
  const formSchema = makeSchema(allInterests, allProjects);
  const bridge = new SimpleSchema2Bridge(formSchema);
  // Now create the model with all the user information.
  const projects = _.pluck(ProfilesProjects.collection.find({ profile: email }).fetch(), 'project');
  const interests = _.pluck(ProfilesInterests.collection.find({ profile: email }).fetch(), 'interest');
  const profile = Profiles.collection.findOne({ email });
  const roleAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
  const model = _.extend({}, profile, { interests, projects, roleAdmin });
  return (ready ? (
    <Container id={PageIDs.editProfilePage} className="justify-content-center" style={pageStyle}>
      <Col>
        <Col className="justify-content-center text-center"><h2>Profile</h2></Col>
        <AutoForm model={model} schema={bridge} onSubmit={data => submit(data)} />
      </Col>
    </Container>
  ) : <LoadingSpinner />);
};

export default EditProfile;
