import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Sponsors } from '../sponsors/Sponsors';

/** Encapsulates state and variable values for this collection. */
class ProjectsSponsorsCollection {
  constructor() {
    // The name of this collection.
    this.name = 'ProjectsSponsorsCollection';
    // Define the Mongo collection.
    this.collection = new Mongo.Collection(this.name);
    // Define the structure of each document in the collection.
    this.schema = new SimpleSchema({
      project: String,
      sponsor: String,
    });
    // Ensure collection documents obey schema.
    this.collection.attachSchema(this.schema);
    // Define names for publications and subscriptions
    this.userPublicationName = `${this.name}.publication.user`;
    this.adminPublicationName = `${this.name}.publication.admin`;
  }
}

export const ProjectsSponsors = new ProjectsSponsorsCollection();
