import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

/** Encapsulates state and variable values for this collection. */
class SponsorsCollection {
  constructor() {
    // The name of this collection.
    this.name = 'SponsorsCollection';
    // Define the Mongo collection.
    this.collection = new Mongo.Collection(this.name);
    // Define the structure of each document in the collection.
    this.schema = new SimpleSchema({
      name: { type: String, index: true, unique: true },
      logo: String,
      email: String,
    });
    // Ensure collection documents obey schema.
    this.collection.attachSchema(this.schema);
    // Define names for publications and subscriptions
    this.userPublicationName = `${this.name}.publication.user`;
    this.adminPublicationName = `${this.name}.publication.admin`;
  }
}

/* Default Sponsors not actually affiliated with Projects
  "defaultSponsors": [
    {
      "name": "Daniel Port",
      "email": "dport@hawaii.edu",
      "logo": "https://avatars.githubusercontent.com/u/7742134?v=4"
    },
    {
      "name": "ICS Department, UH",
      "email": "icsinfo@hawaii.edu",
      "logo": "https://www.ics.hawaii.edu/wp-content/uploads/2021/04/ICS-Logo-for-dark-150x150-1.png"
    },
    {
      "name": "ACM@MANOA",
      "email": "communications@acmmanoa.org",
      "logo": "https://avatars.githubusercontent.com/u/123935500?s=200&v=4"
    },
    {
      "name": "ICSatKCC",
      "email": "ljmiller@hawaii.edu",
      "logo": "https://avatars.githubusercontent.com/u/19316485?s=200&v=4"
    }

  ],
  */

export const Sponsors = new SponsorsCollection();
