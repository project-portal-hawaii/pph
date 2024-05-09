import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Badge, Container, Card, Row, Col, Button, Image } from 'react-bootstrap';
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
import { ProjectsSubscribers } from '../../api/projects/ProjectsSubscribers';
import { expressInterest } from '../utilities/projectUtils';

/* Gets the Project data as well as Profiles and Interests associated with the passed Project name. */
function getProjectData(name) {
  const data = Projects.collection.findOne({ name });
  const interests = _.pluck(ProjectsInterests.collection.find({ project: name }).fetch(), 'interest');
  const profiles = _.pluck(ProfilesProjects.collection.find({ project: name }).fetch(), 'profile');
  const sponsors = _.pluck(ProjectsSponsors.collection.find({ project: name }).fetch(), 'sponsor');
  const subscribers = _.pluck(ProjectsSubscribers.collection.find({ project: name }).fetch(), 'profile');
  const profilePictures = profiles.map(profile => Profiles.collection.findOne({ email: profile })?.picture);
  return _.extend({}, data, { interests, sponsors, subscribers, participants: profilePictures });
}

/* Component for layout out a Project Card. */
const MakeCard = ({ project }) => {
  const [interestedCount, setInterestedCount] = useState(0);

  useTracker(() => {
    const interestsHandle = Meteor.subscribe(ProjectsSubscribers.userPublicationName);
    if (interestsHandle.ready()) {
      const count = ProjectsSubscribers.collection.find({ project: project.name }).count();
      setInterestedCount(count);
    }
  }, [project.name]);

  return (
    <Col>
      <Card className="my-2 singleProjectCardBody">
        <Card.Body className="d-flex flex-column align-items-center justify-content-center">
          <Image src={project.picture} fluid style={{ maxHeight: '450px' }} />
          <Card.Title tag="h5" style={{ marginTop: '0px' }}>{project.name}</Card.Title>
          <p><i>FULL DESCRIPTION:</i></p>
          <Card.Subtitle>
            <span className="date">{project.title}</span>
          </Card.Subtitle>
          <Card.Text style={{ maxWidth: '50%', textAlign: 'center' }}>
            {project.description}
          </Card.Text>
          <Card.Text>
            {project.sponsors.map((sponsor, index) => <Badge key={index}>{sponsor}</Badge>)}
            {project.interests.map((interest, index) => <Badge key={index} bg="info">{interest}</Badge>)}
          </Card.Text>
          <Card.Text>
            {interestedCount <= 1 ? <i className="bi bi-person" /> : <i className="bi bi-people" /> } {interestedCount} {interestedCount === 1 ? 'person is ' : 'people are '}interested
          </Card.Text>
          <Card.Text>
            <Button className="interestButton" onClick={() => expressInterest(project.name)}>Express Interest</Button>
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};

MakeCard.propTypes = {
  project: PropTypes.shape({
    description: PropTypes.string,
    name: PropTypes.string,
    participants: PropTypes.arrayOf(PropTypes.string),
    picture: PropTypes.string,
    title: PropTypes.string,
    interests: PropTypes.arrayOf(PropTypes.string),
    sponsors: PropTypes.arrayOf(PropTypes.string),
    subscribers: PropTypes.arrayOf(PropTypes.string),
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
    const sub5 = Meteor.subscribe(Sponsors.userPublicationName);
    const sub6 = Meteor.subscribe(ProjectsSponsors.userPublicationName);
    return {
      ready: sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready() && sub5.ready() && sub6.ready(),
    };
  }, []);
  const projects = _.pluck(Projects.collection.find().fetch(), 'name');
  const projectData = projects.map(project => getProjectData(project));
  const singleProject = _.sample(projectData);
  return ready ? (
    <Row id={PageIDs.projectsPage} className="singleProject" style={pageStyle}>
      <Row classname="justify-content-center">
        <h1 className="text-center pb-4">Explore projects one at a time</h1>
        <hr style={{ maxWidth: '50%', margin: 'auto' }} />
      </Row>
      <Container style={{ width: '70%', ...pageStyle }}>
        <Row className="pt-3 mb-4">
          <MakeCard project={singleProject} />
        </Row>
        <hr style={{ width: '70%', margin: 'auto' }} />
        <Row className="justify-content-center">
          <div className="text-center">
            {/* eslint-disable-next-line no-restricted-globals */}
            <Button className="interestButton my-4" onClick={() => location.reload()}>
              View another project
            </Button>
          </div>
        </Row>
      </Container>
    </Row>
  ) : <LoadingSpinner />;
};

export default SingleProjectPage;
