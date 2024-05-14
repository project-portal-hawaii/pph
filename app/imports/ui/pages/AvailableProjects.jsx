import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Badge, Container, Card, Image, Row, Col, Button, Form } from 'react-bootstrap';
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
import { ProjectsComments } from '../../api/projects/ProjectsComments';

/* Gets the Project data as well as Profiles and Interests associated with the passed Project name. */
function getProjectData(name) {
  const data = Projects.collection.findOne({ name });
  const interests = _.pluck(ProjectsInterests.collection.find({ project: name }).fetch(), 'interest');
  const statuses = _.pluck(ProjectsStatuses.collection.find({ project: name }).fetch(), 'status');
  const profiles = _.pluck(ProfilesProjects.collection.find({ project: name }).fetch(), 'profile');
  const sponsors = _.pluck(ProjectsSponsors.collection.find({ project: name }).fetch(), 'sponsor');
  const subscribers = _.pluck(ProjectsSubscribers.collection.find({ project: name }).fetch(), 'profile');
  const comments = ProjectsComments.collection.find({ projectId: data._id }).fetch();
  const profilePictures = profiles.map(profile => Profiles.collection.findOne({ email: profile })?.picture);
  return _.extend({}, data, { interests, statuses, sponsors, subscribers, comments, participants: profilePictures });
}

/* Component for layout out a Project Card. */
const MakeCard = ({ project, handleCommentSubmit }) => {
  const [interestedCount, setInterestedCount] = useState(0);
  const [comment, setComments] = useState([]);

  useTracker(() => {
    const interestsHandle = Meteor.subscribe(ProjectsSubscribers.userPublicationName);
    if (interestsHandle.ready()) {
      const count = ProjectsSubscribers.collection.find({ project: project.name }).count();
      setInterestedCount(count);
    }
  }, [project.name]);
  useTracker(() => {
    const commentsHandle = Meteor.subscribe(ProjectsComments.userPublicationName, project._id);
    if (commentsHandle.ready()) {
      const commentsData = ProjectsComments.collection.find({ project: project._id }).fetch();
      setComments(commentsData);
    }
  }, [project._id]);
  return (
    <Col>
      <Card className="h-100">
        <Card.Body>
          <Image src={project.picture} width={100} rounded />
          <Card.Title style={{ marginTop: '0px' }}>{project.name}</Card.Title>
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
          {project.comments.map((c, index) => (
            <div key={index}>
              <p>{c.name}</p>
              <p>{c.createdAt.toLocaleString()}</p>
              <p>{c.comment}</p>
            </div>
          ))}
        </Card.Body>
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Leave a comment here..."
              value={comment}
              onChange={(e) => setComments(e.target.value)}
            />
          </Form.Group>
          <Button variant="success" onClick={() => handleCommentSubmit(project, comment)}>Post Comment</Button>
        </Card.Body>{Meteor.user() ? (
          <Card.Footer style={{ backgroundColor: 'transparent' }}>
            <Card.Text>
              {interestedCount} {interestedCount === 1 ? 'person is' : 'people are'} interested
            </Card.Text>
            <Button variant="success" onClick={() => expressInterest(project.name)}>Express Interest</Button>
          </Card.Footer>
        ) : '' }
      </Card>
    </Col>
  );
};

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
    sponsors: PropTypes.arrayOf(PropTypes.string),
    subscribers: PropTypes.arrayOf(PropTypes.string),
    comments: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      createdAt: PropTypes.instanceOf(Date),
      comment: PropTypes.string,
    })),
  }).isRequired,
  handleCommentSubmit: PropTypes.func.isRequired,
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
    const sub10 = Meteor.subscribe(ProjectsComments.userPublicationName);
    return {
      ready: sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready() && sub5.ready() && sub6.ready() && sub7.ready() && sub8.ready() && sub9.ready() && sub10.ready(),
    };
  }, []);

  const projects = _.pluck(Projects.collection.find().fetch(), 'name');
  const projectData = projects.map(project => getProjectData(project));

  const handleCommentSubmit = (project, comment) => {
    if (comment.trim() !== '' && Meteor.userId()) {
      const user = Meteor.user();
      const userEmail = user.emails[0].address;
      const profile = Profiles.collection.findOne({ email: userEmail });
      if (profile) {
        const userName = `${profile.firstName} ${profile.lastName}`;
        const newComment = {
          projectId: project._id,
          userId: Meteor.userId(),
          name: userName,
          comment: comment.trim(),
          createdAt: new Date(),
        };
        console.error('newComment = ', newComment);
        try {
          ProjectsComments.schema.validate(newComment);
          ProjectsComments.collection.insert(newComment);
          console.log('Comment insertion passed for newComment:', newComment);
        } catch (e) {
          console.error('Comment insertion error:', e.message);
        }
      } else {
        console.error('User profile not found for email: ', userEmail);
      }
    }
  };
  return ready ? (
    <Container id={PageIDs.projectsPage} style={pageStyle} className="availableProjects">
      <h1 className="text-center pb-4">Browse available projects from the community</h1>
      <hr style={{ maxWidth: '70%', margin: 'auto' }} />
      <Row xs={1} md={2} lg={4} className="g-2">
        {
          projectData.map((project, index) => {
            if (project.statuses.includes('Published')) {
              return (
                <MakeCard
                  key={index}
                  project={project}
                  /* eslint-disable-next-line no-shadow */
                  handleCommentSubmit={(project, comment) => handleCommentSubmit(project, comment)}
                />
              );
            }
            return false;
          })
        }
      </Row>
    </Container>
  ) : <LoadingSpinner />;
};

export default AvailableProjectsPage;
