import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
// import { Tracker } from 'meteor/tracker';
/**
 * The StuffsCollection. It encapsulates state and variable values for comments.
 */
class CommentsCollection {

  constructor() {
    // The name of this collection.
    this.name = 'CommentsCollection';
    // Define the Mongo collection.
    this.collection = new Mongo.Collection(this.name);
    // Define the structure of each document in the collection.
    this.schema = new SimpleSchema({
      name: String,
      comment: String,
      userId: String,
      createdAt: Date,
    });
    // Attach the schema to the collection, so all attempts to insert a document are checked against schema.
    this.collection.attachSchema(this.schema);
    // Define names for publications and subscriptions
    this.userPublicationName = `${this.name}.publication.user`;
    this.adminPublicationName = `${this.name}.publication.admin`;
  }
}

/**
 * The singleton instance of the CommentsCollection.
 * @type {CommentsCollection}
 */
export const Comments = new CommentsCollection();
