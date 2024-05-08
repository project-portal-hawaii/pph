import React, { useState } from 'react';
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
import { ProjectsSubscribers } from '../../api/projects/ProjectsSubscribers';
import { expressInterest } from '../utilities/projectUtils';

/* Gets the Project data as well as Profiles and Interests associated with the passed Project name. */
function getProjectData(name) {
  const data = Projects.collection.findOne({ name });
  const interests = _.pluck(ProjectsInterests.collection.find({ project: name }).fetch(), 'interest');
  const statuses = _.pluck(ProjectsStatuses.collection.find({ project: name }).fetch(), 'status');
  const profiles = _.pluck(ProfilesProjects.collection.find({ project: name }).fetch(), 'profile');
  const sponsors = _.pluck(ProjectsSponsors.collection.find({ project: name }).fetch(), 'sponsor');
  const subscribers = _.pluck(ProjectsSubscribers.collection.find({ project: name }).fetch(), 'profile');
  const profilePictures = profiles.map(profile => Profiles.collection.findOne({ email: profile })?.picture);
  return _.extend({}, data, { interests, statuses, sponsors, subscribers, participants: profilePictures });
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
      <Card className="availableProjectCard h-100">
        <Card.Body className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '350px' }}>
          <Image src={project.picture} fluid style={{ maxHeight: '250px' }} />
          <Card.Title className="mt-2">{project.name}</Card.Title>
          <Card.Subtitle>
            <span className="date">{project.title}</span>
          </Card.Subtitle>
          <Card.Text>
            {`${project.description.slice(0, 100)}...`}
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
          <Card.Text>
            {interestedCount <= 1 ? <i className="bi bi-person" /> : <i className="bi bi-people" /> } {interestedCount} {interestedCount === 1 ? 'person is ' : 'people are '}interested
          </Card.Text>
          <button type="button" onClick={() => expressInterest(project.name)}>Express Interest</button>
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
const AvailableProjectsPage = () => {
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
    const sub9 = Meteor.subscribe(ProjectsSubscribers.userPublicationName);
    return {
      ready: sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready() && sub5.ready() && sub6.ready() && sub7.ready() && sub8.ready() && sub9.ready(),
    };
  }, []);
  const projects = _.pluck(Projects.collection.find().fetch(), 'name');
  const projectData = projects.map(project => getProjectData(project));
  return ready ? (
    <Row id={PageIDs.projectsPage} style={{ paddingLeft: '200px', paddingRight: '200px', ...pageStyle }}>
      <Col>
        <Row xs={1} md={2} lg={4} className="g-2 availableProjectsRow">
          {
            projectData.map((project, index) => {
              if (project.statuses.includes('Published')) {
                return (
                  <Col xs={12} md={6} lg={3} className="availableProject">
                    <MakeCard key={index} project={project} />
                  </Col>
                );
              }
              return false;
            })
          }
        </Row>
      </Col>
    </Row>
  ) : <LoadingSpinner />;
};

export default AvailableProjectsPage;
