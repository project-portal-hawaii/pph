import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Badge, Container, Card, Image, Row, Col } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { Profiles } from '../../api/profiles/Profiles';
import { ProfilesProjects } from '../../api/profiles/ProfilesProjects';
import { Projects } from '../../api/projects/Projects';
import { ProjectsInterests } from '../../api/projects/ProjectsInterests';
import { Sponsors } from '../../api/sponsors/Sponsors';
import { ProjectsSponsors } from '../../api/projects/ProjectsSponsors';
import LoadingSpinner from '../components/LoadingSpinner';
import { pageStyle } from './pageStyles';
import { PageIDs } from '../utilities/ids';

/* Gets the Project data as well as Profiles and Interests associated with the passed Project name. */
function getProjectData(name) {
  const data = Projects.collection.findOne({ name });
  const interests = _.pluck(ProjectsInterests.collection.find({ project: name }).fetch(), 'interest');
  const profiles = _.pluck(ProfilesProjects.collection.find({ project: name }).fetch(), 'profile');
  const sponsors = _.pluck(ProjectsSponsors.collection.find({ project: name }).fetch(), 'sponsor');
  const profilePictures = profiles.map(profile => Profiles.collection.findOne({ email: profile })?.picture);
  return _.extend({}, data, { interests, sponsors, participants: profilePictures });
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
        <Card.Body>
          {project.sponsors.map((sponsor, index) => <Badge key={index}>{sponsor}</Badge>)}
        </Card.Body>
        <Card.Body>
          {project.interests.map((interest, index) => <Badge key={index} bg="info">{interest}</Badge>)}
        </Card.Body>
        <Card.Body>
          {project.participants.map((p, index) => <Image key={index} roundedCircle src={p} width={50} />)}
        </Card.Body>
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
    date: PropTypes.string,
    students: PropTypes.string,
    video: PropTypes.string,
    testimonials: PropTypes.string,
    techStack: PropTypes.string,
    instructor: PropTypes.string,
    image: PropTypes.string,
    poster: PropTypes.string,
    sponsors: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

/* Renders the Project Collection as a set of Cards. */
const AvailableProjectsPage = () => {
  const { ready } = useTracker(() => {
    // Ensure that minimongo is populated with all collections prior to running render().
    const sub1 = Meteor.subscribe(ProfilesProjects.userPublicationName);
    const sub2 = Meteor.subscribe(Projects.userPublicationName);
    const sub3 = Meteor.subscribe(ProjectsInterests.userPublicationName);
    const sub4 = Meteor.subscribe(Profiles.userPublicationName);
    const sub5 = Meteor.subscribe(Sponsors.userPublicationName);
    const sub6 = Meteor.subscribe(ProjectsSponsors.userPublicationName);
    return {
      ready: sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready() && sub5.ready() && sub6.ready(),
    };
  }, []);
  const projects = _.pluck(Projects.collection.find().fetch(), 'name');
  const projectData = projects.map(project => getProjectData(project));
  return ready ? (
    <Container id={PageIDs.projectsPage} style={pageStyle}>
      <Row xs={1} md={2} lg={4} className="g-2">
        {projectData.map((project, index) => <MakeCard key={index} project={project} />)}
      </Row>
    </Container>
  ) : <LoadingSpinner />;
};

export default AvailableProjectsPage;
