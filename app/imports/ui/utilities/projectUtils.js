import { Meteor } from 'meteor/meteor';
import { ProjectsSubscribers } from '../../api/projects/ProjectsSubscribers';

export const expressInterest = (projectName) => {
  // Check if user is logged in.
  if (!Meteor.userId()) {
    throw new Meteor.Error('not-authorized', 'You must be logged in to express interest in a project.');
  }
  // Check if user has already expressed interest.
  const existingSubscriber = ProjectsSubscribers.collection.findOne({ project: projectName, profile: Meteor.userId() });
  if (existingSubscriber) {
    throw new Meteor.Error('already-expressed', 'You have already expressed interest in this project.');
  }
  ProjectsSubscribers.collection.insert({ project: projectName, profile: Meteor.userId() });
};
