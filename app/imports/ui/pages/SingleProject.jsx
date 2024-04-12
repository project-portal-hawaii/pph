import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Badge, Container, Card, Image, Row, Col, Button } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { Profiles } from '../../api/profiles/Profiles';
import { ProfilesProjects } from '../../api/profiles/ProfilesProjects';
import { Projects } from '../../api/projects/Projects';
import { ProjectsInterests } from '../../api/projects/ProjectsInterests';
import LoadingSpinner from '../components/LoadingSpinner';
import { pageStyle } from './pageStyles';
import { PageIDs } from '../utilities/ids';

/* Gets the Project data as well as Profiles and Interests associated with the passed Project name. */
function getProjectData(name) {
  const data = Projects.collection.findOne({ name });
  const interests = _.pluck(ProjectsInterests.collection.find({ project: name }).fetch(), 'interest');
  const profiles = _.pluck(ProfilesProjects.collection.find({ project: name }).fetch(), 'profile');
  const profilePictures = profiles.map(profile => Profiles.collection.findOne({ email: profile })?.picture);
  return _.extend({}, data, { interests, participants: profilePictures });
}

/* Component for layout out a Project Card. */
const MakeCard = ({ project }) => (
  <Col>
    <Card className="my-2">
      <Card.Body>
        <Card.Img src={project.picture} style={{ width: '450px', height: '450px' }} />
        <Card.Title tag="h5" style={{ marginTop: '0px' }}>{project.name}</Card.Title>
        <p><i>FULL DESCRIPTION:</i></p>
        <Card.Subtitle>
          <span className="date">{project.title}</span>
        </Card.Subtitle>
        <Card.Text>
          {project.description}
        </Card.Text>
      </Card.Body>
      <Card.Body>
        {project.interests.map((interest, index) => <Badge key={index} bg="info">{interest}</Badge>)}
      </Card.Body>
    </Card>
  </Col>
);

MakeCard.propTypes = {
  project: PropTypes.shape({
    description: PropTypes.string,
    name: PropTypes.string,
    participants: PropTypes.arrayOf(PropTypes.string),
    picture: PropTypes.string,
    title: PropTypes.string,
    interests: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

/* Renders the Project Collection as a set of Cards. */
const SingleProjectPage = () => {
  const { ready } = useTracker(() => {
    // Ensure that minimongo is populated with all collections prior to running render().
    const sub1 = Meteor.subscribe(ProfilesProjects.userPublicationName);
    const sub2 = Meteor.subscribe(Projects.userPublicationName);
    const sub3 = Meteor.subscribe(ProjectsInterests.userPublicationName);
    const sub4 = Meteor.subscribe(Profiles.userPublicationName);
    return {
      ready: sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready(),
    };
  }, []);
  const projects = _.pluck(Projects.collection.find().fetch(), 'name');
  const projectData = projects.map(project => getProjectData(project));
  const singleProject = _.sample(projectData);
  return ready ? (
    <Container id={PageIDs.projectsPage} style={pageStyle}>
      <Row className="g-2">
        <MakeCard project={singleProject} />
      </Row>
      <Button>Add Project</Button>
    </Container>
  ) : <LoadingSpinner />;
};

export default SingleProjectPage;
