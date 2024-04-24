import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

/** Encapsulates state and variable values for this collection. */
class ProjectsCollection {
  constructor() {
    // The name of this collection.
    this.name = 'ProjectsCollection';
    // Define the Mongo collection.
    this.collection = new Mongo.Collection(this.name);
    // Define the structure of each document in the collection.
    this.schema = new SimpleSchema({
      name: { type: String, index: true, unique: true },
      homepage: { type: String, optional: true },
      description: { type: String, optional: true },
      // This will be the Thumbnail Image
      picture: { type: String, optional: true },
      sponsors: { type: String, optional: true },
      // Everything after this point are added fields
      date: { type: String, optional: true },
      students: { type: String, optional: true },
      video: { type: String, optional: true },
      testimonials: { type: String, optional: true },
      techStack: { type: String, optional: true },
      instructor: { type: String, optional: true },
      image: { type: String, optional: true },
      poster: { type: String, optional: true },
    });
    // Ensure collection documents obey schema.
    this.collection.attachSchema(this.schema);
    // Define names for publications and subscriptions
    this.userPublicationName = `${this.name}.publication.user`;
    this.adminPublicationName = `${this.name}.publication.admin`;
  }
}

export const Projects = new ProjectsCollection();
