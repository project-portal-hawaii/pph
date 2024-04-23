import React from 'react';
import { Image, Card, ListGroup } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Comment from './Comment';
import AddComment from './AddComment';

/* Component for layout out a Project Card. */
const Project = ({ project, comments }) => (
  <Card className="h-100">
    <Card.Header>
      <Image src={project.picture} width={75} />
      <Card.Title>{project.title} </Card.Title>
      <Card.Subtitle>{project.name}</Card.Subtitle>
    </Card.Header>
    <Card.Body>
      <Card.Text>{project.description}</Card.Text>
      <ListGroup variant="flush">
        {comments.map((note) => <Comment key={note._id} note={note} />)}
      </ListGroup>
      {/* <AddComment owner={project.owner} projectId={project._id} />  */}
      <AddComment owner={project.owner} projectId={project} />
      {/* <Link to={`/edit/${project._id}`}>Edit</Link> */}
    </Card.Body>
  </Card>
);

Project.propTypes = {
  project: PropTypes.shape({
    description: PropTypes.string,
    name: PropTypes.string,
    participants: PropTypes.arrayOf(PropTypes.string),
    picture: PropTypes.string,
    title: PropTypes.string,
    interests: PropTypes.arrayOf(PropTypes.string),
    owner: PropTypes.string,
  }).isRequired,
  comments: PropTypes.arrayOf(PropTypes.shape({
    comment: PropTypes.string,
    projectId: PropTypes.string,
    owner: PropTypes.string,
    createdAt: PropTypes.instanceOf(Date),
    _id: PropTypes.string,
  })).isRequired,
};

export default Project;
