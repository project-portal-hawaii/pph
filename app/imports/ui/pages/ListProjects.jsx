import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Col, Container, Row } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import LoadingSpinner from '../components/LoadingSpinner';
import Project from '../components/Project';
import { Projects } from '../../api/projects/Projects';
import { Comments } from '../../api/comment/Comments';

console.log('Hello');
/* Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
const ListProjects = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, projects, comments } = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    // Get access to Stuff documents.
    const subscription = Meteor.subscribe(Projects.userPublicationName);
    const subscription2 = Meteor.subscribe(Comments.userPublicationName);
    // Determine if the subscription is ready
    const rdy = subscription.ready() && subscription2.ready();
    // Get the Contacts documents
    const projectItems = Projects.collection.find({}).fetch();
    // Get the Note documents
    const commentItems = Comments.collection.find({}).fetch();
    return {
      projects: projectItems,
      comments: commentItems,
      ready: rdy,
    };
  }, []);

  return (ready ? (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col>
          <Col className="text-center">
            <h2>List Projects</h2>
          </Col>
          <Row xs={1} md={2} lg={3} className="g-4">
            {projects.map((project) => (<Col key={project._id}><Project project={project} comments={comments.filter(comment => (comment.userId === project._id))} /></Col>))}
          </Row>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default ListProjects;
