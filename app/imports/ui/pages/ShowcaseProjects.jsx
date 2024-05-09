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
import { Statuses } from '../../api/statuses/Statuses';
import { ProjectsStatuses } from '../../api/projects/ProjectsStatuses';
import Collapsible from '../components/Collapsible';

/* Gets the Project data as well as Profiles and Interests associated with the passed Project name. */
function getProjectData(name) {
  const data = Projects.collection.findOne({ name });
  const interests = _.pluck(ProjectsInterests.collection.find({ project: name }).fetch(), 'interest');
  const statuses = _.pluck(ProjectsStatuses.collection.find({ project: name }).fetch(), 'status');
  const profiles = _.pluck(ProfilesProjects.collection.find({ project: name }).fetch(), 'profile');
  const sponsors = _.pluck(ProjectsSponsors.collection.find({ project: name }).fetch(), 'sponsor');
  const profilePictures = profiles.map(profile => Profiles.collection.findOne({ email: profile })?.picture);
  return _.extend({}, data, { interests, statuses, sponsors, participants: profilePictures });
}

/* Need to modify to be showcase version */
const MakeCard = ({ project }) => (
  <Col>
    <Card className="h-100">
      <Card.Body>
        <Image src={project.picture} width={100} rounded center />
        <Card.Title style={{ marginTop: '0px' }}>{project.name}</Card.Title>
        <Card.Subtitle>
          <span className="date">{project.title}</span>
        </Card.Subtitle>
        <Card.Subtitle>
          {project.date}
        </Card.Subtitle>
        <Card.Text>
          {project.description}
        </Card.Text>
      </Card.Body>
      <Card.Body>
        {project.sponsors.map((sponsor, index) => <Badge key={index}>{sponsor}</Badge>)}
      </Card.Body>
      <Card.Body>
        {project.interests.map((interest, index) => <Badge key={index} bg="info">{interest}</Badge>)}
      </Card.Body>
      <Card.Body>
        {project.participants.map((p, index) => <Image key={index} roundedCircle src={p} width={50} />)}
      </Card.Body>
      <Card.Body>
        <Collapsible
          open={false}
          title="Show all information"
        >
          <Image
            src={project.image}
          />
          <h3 className="py-1">Instructor: {project.instructor}</h3>
          <h6>Students: {project.students}</h6>
          <p className="py-4">
            {project.testimonials}
          </p>
          <iframe src={project.video} width={1000} height={500} title={project.name}/>
          <Image src={project.poster} />
        </Collapsible>
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
    statuses: PropTypes.arrayOf(PropTypes.string),
    sponsors: PropTypes.arrayOf(PropTypes.string),
    subscribers: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

/* Renders the Project Collection as a set of Cards. */
const ShowcaseProjectsPage = () => {
  const { ready } = useTracker(() => {
    // Ensure that minimongo is populated with all collections prior to running render().
    const sub1 = Meteor.subscribe(ProfilesProjects.userPublicationName);
    const sub2 = Meteor.subscribe(Projects.userPublicationName);
    const sub3 = Meteor.subscribe(ProjectsInterests.userPublicationName);
    const sub4 = Meteor.subscribe(Profiles.userPublicationName);
    const sub5 = Meteor.subscribe(Statuses.userPublicationName);
    const sub6 = Meteor.subscribe(ProjectsStatuses.userPublicationName);
    const sub7 = Meteor.subscribe(Sponsors.userPublicationName);
    const sub8 = Meteor.subscribe(ProjectsSponsors.userPublicationName);
    return {
      ready: sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready() && sub5.ready() && sub6.ready() && sub7.ready() && sub8.ready(),
    };
  }, []);
  const projects = _.pluck(Projects.collection.find().fetch(), 'name');
  const projectData = projects.map(project => getProjectData(project));
  return ready ? (
    <Container id={PageIDs.showcaseProjectsPage} style={pageStyle}>
      <Row xs={1} md={2} lg={1} className="g-2">
        {
          projectData.map((project, index) => {
            if (project.statuses.includes('Showcase')) {
              return (<MakeCard key={index} project={project} />);
            }
            return false;
          })
        }
      </Row>
    </Container>
  ) : <LoadingSpinner />;
};

export default ShowcaseProjectsPage;
