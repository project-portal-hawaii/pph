import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Interests } from '../../api/interests/Interests';
import { Profiles } from '../../api/profiles/Profiles';
import { ProfilesInterests } from '../../api/profiles/ProfilesInterests';
import { ProfilesProjects } from '../../api/profiles/ProfilesProjects';
import { Projects } from '../../api/projects/Projects';
import { ProjectsInterests } from '../../api/projects/ProjectsInterests';
import { Statuses } from '../../api/statuses/Statuses';
import { ProjectsStatuses } from '../../api/projects/ProjectsStatuses';
import { Comments } from '../../api/comment/Comments';
import { Sponsors } from '../../api/sponsors/Sponsors';
import { ProjectsSponsors } from '../../api/projects/ProjectsSponsors';
import { ProjectsSubscribers } from '../../api/projects/ProjectsSubscribers';

/** Define a publication to publish all sponsors. */
Meteor.publish(Sponsors.userPublicationName, () => Sponsors.collection.find());

/** Define a publication to publish all ProjectsSponsors. */
Meteor.publish(ProjectsSponsors.userPublicationName, () => ProjectsSponsors.collection.find());

/** Define a publication to publish all interests. */
Meteor.publish(Interests.userPublicationName, () => Interests.collection.find());

/** Define a publication to publish all profiles. */
Meteor.publish(Profiles.userPublicationName, () => Profiles.collection.find());

/** Define a publication to publish this collection. */
Meteor.publish(ProfilesInterests.userPublicationName, () => ProfilesInterests.collection.find());

/** Define a publication to publish this collection. */
Meteor.publish(ProfilesProjects.userPublicationName, () => ProfilesProjects.collection.find());

/** Define a publication to publish all projects. */
Meteor.publish(Projects.userPublicationName, () => Projects.collection.find());

/** Define a publication to publish this collection. */
Meteor.publish(ProjectsInterests.userPublicationName, () => ProjectsInterests.collection.find());

/** Define a publication to publish this collection. */
Meteor.publish(ProjectsSubscribers.userPublicationName, () => ProjectsSubscribers.collection.find());

/** Define a publication to publish all interests. */
Meteor.publish(Statuses.userPublicationName, () => Statuses.collection.find());

/** Define a publication to publish this collection. */
Meteor.publish(ProjectsStatuses.userPublicationName, () => ProjectsStatuses.collection.find());

// alanning:roles publication
// Recommended code to publish roles for each user.
Meteor.publish(null, function () {
  if (this.userId) {
  // return Meteor.roleAssignment.find({ 'user._id': this.userId });
    return Meteor.roleAssignment.find();
  }
  return this.ready();
});

// Publish all users for admin role
Meteor.publish('allUsers', function () {
  if (this.userId && Roles.userIsInRole(this.userId, 'admin')) {
    return Meteor.users.find({}, { fields: { username: 1, emails: 1 } });
  }
  return this.ready();
});

Meteor.publish(Comments.userPublicationName, function () {
  if (this.userId) {
    const name = Meteor.users.findOne(this.userId).name;
    return Comments.collection.find({ owner: name });
  }
  return this.ready();
});
