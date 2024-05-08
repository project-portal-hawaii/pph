import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

/** Encapsulates state and variable values for this collection. */
class ProjectsSubscribersCollection {
  constructor() {
    // The name of this collection.
    this.name = 'ProjectsSubscribersCollection';
    // Define the Mongo collection.
    this.collection = new Mongo.Collection(this.name);
    // Define the structure of each document in the collection.
    this.schema = new SimpleSchema({
      project: String,
      profile: String,
    });
    // Ensure collection documents obey schema.
    this.collection.attachSchema(this.schema);
    // Define names for publications and subscriptions
    this.userPublicationName = `${this.name}.publication.user`;
    this.adminPublicationName = `${this.name}.publication.admin`;

    if (!Meteor.isServer) { return; }
    this.collection.allow({
      // eslint-disable-next-line no-unused-vars
      insert(userId, _doc) {
        return userId;
      },
    });
  }
}

export const ProjectsSubscribers = new ProjectsSubscribersCollection();
