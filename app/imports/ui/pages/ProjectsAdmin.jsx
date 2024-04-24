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
import { ComponentIDs, PageIDs } from '../utilities/ids';
import { Statuses } from '../../api/statuses/Statuses';
import { ProjectsStatuses } from '../../api/projects/ProjectsStatuses';

/* Gets the Project data as well as Profiles and Interests associated with the passed Project name. */
function getProjectData(name) {
  const data = Projects.collection.findOne({ name });
  const interests = _.pluck(ProjectsInterests.collection.find({ project: name }).fetch(), 'interest');
  const statuses = _.pluck(ProjectsStatuses.collection.find({ project: name }).fetch(), 'status');
  const profiles = _.pluck(ProfilesProjects.collection.find({ project: name }).fetch(), 'profile');
  const profilePictures = profiles.map(profile => Profiles.collection.findOne({ email: profile })?.picture);
  return _.extend({}, data, { interests, statuses, participants: profilePictures });
}

/* Component for layout out a Project Card. */
const MakeCard = ({ project }) => (
  <Col>
    <Card className="h-100">
      <Card.Body>
        <Image src={project.picture} width={100} rounded center />
        <Card.Title style={{ marginTop: '0px' }}>{project.name}</Card.Title>
        <Card.Subtitle>
          <span className="date">{project.title}</span>
        </Card.Subtitle>
        <Card.Text>
          {`${project.description.slice(0, 100)}...`}
        </Card.Text>
        <Card.Text>
          {`status: ${project.statuses}`}
        </Card.Text>
        <Card.Text>
          {`instructor: ${project.instructor}`}
        </Card.Text>
      </Card.Body>
      <Card.Body>
        {project.interests.map((interest, index) => <Badge key={index} bg="info">{interest}</Badge>)}
      </Card.Body>
      <Card.Body>
        {project.participants.map((p, index) => <Image key={index} roundedCircle src={p} width={50} />)}
      </Card.Body>
      <Card.Body>
        <Button href={`/editproject/${project._id}`} id={ComponentIDs.editProjectButton} variant="success">Edit</Button>
      </Card.Body>
    </Card>
  </Col>
);

MakeCard.propTypes = {
  project: PropTypes.shape({
    _id: PropTypes.string,
    description: PropTypes.string,
    name: PropTypes.string,
    participants: PropTypes.arrayOf(PropTypes.string),
    picture: PropTypes.string,
    title: PropTypes.string,
    interests: PropTypes.arrayOf(PropTypes.string),
    date: PropTypes.string,
    students: PropTypes.string,
    video: PropTypes.string,
    testimonials: PropTypes.string,
    techStack: PropTypes.string,
    instructor: PropTypes.string,
    image: PropTypes.string,
    poster: PropTypes.string,
    statuses: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

/* Renders the Project Collection as a set of Cards. */
const ProjectsAdminPage = () => {
  const { ready } = useTracker(() => {
    // Ensure that minimongo is populated with all collections prior to running render().
    const sub1 = Meteor.subscribe(ProfilesProjects.userPublicationName);
    const sub2 = Meteor.subscribe(Projects.userPublicationName);
    const sub3 = Meteor.subscribe(ProjectsInterests.userPublicationName);
    const sub4 = Meteor.subscribe(Profiles.userPublicationName);
    const sub5 = Meteor.subscribe(Statuses.userPublicationName);
    const sub6 = Meteor.subscribe(ProjectsStatuses.userPublicationName);
    return {
      ready: sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready() && sub5.ready() && sub6.ready(),
    };
  }, []);
  const projects = _.pluck(Projects.collection.find().fetch(), 'name');
  const projectData = projects.map(project => getProjectData(project));
  return ready ? (
    <Container id={PageIDs.projectsPage} style={pageStyle}>
      <Row xs={1} md={1} lg={1} className="g-2">
        {
          projectData.map((project, index) => (<MakeCard key={index} project={project} />))
        }
      </Row>
    </Container>
  ) : <LoadingSpinner />;
};

export default ProjectsAdminPage;
