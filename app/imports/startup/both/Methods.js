import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Projects } from '../../api/projects/Projects';
import { Profiles } from '../../api/profiles/Profiles';
import { Comments } from '../../api/comment/Comments';
import { ProfilesInterests } from '../../api/profiles/ProfilesInterests';
import { ProfilesProjects } from '../../api/profiles/ProfilesProjects';
import { ProjectsInterests } from '../../api/projects/ProjectsInterests';
import { ProjectsStatuses } from '../../api/projects/ProjectsStatuses';

/**
 * In Bowfolios, insecure mode is enabled, so it is possible to update the server's Mongo database by making
 * changes to the client MiniMongo DB.
 *
 * However, updating the database via client-side calls can be inconvenient for two reasons:
 *   1. If we want to update multiple collections, we need to use nested callbacks in order to trap errors, leading to
 *      the dreaded "callback hell".
 *   2. For update and removal, we can only provide a docID as the selector on the client-side, making bulk deletes
 *      hard to do via nested callbacks.
 *
 * A simple solution to this is to use Meteor Methods (https://guide.meteor.com/methods.html). By defining and
 * calling a Meteor Method, we can specify code to be run on the server-side but invoked by clients. We don't need
 * to use callbacks, because any errors are thrown and sent back to the client. Also, the restrictions on the selectors
 * are removed for server-side code.
 *
 * Meteor Methods are commonly introduced as the necessary approach to updating the DB once the insecure package is
 * removed, and that is definitely true, but Bowfolios illustrates that they can simplify your code significantly
 * even when prototyping. It turns out that we can remove insecure mode if we want, as we use Meteor methods to update
 * the database.
 *
 * Comment that it would be even better if each method was wrapped in a transaction so that the database would be rolled
 * back if any of the intermediate updates failed. Left as an exercise to the reader.
 */

const updateProfileMethod = 'Profiles.update';

/**
 * The server-side Profiles.update Meteor Method is called by the client-side Home page after pushing the update button.
 * Its purpose is to update the Profiles, ProfilesInterests, and ProfilesProjects collections to reflect the
 * updated situation specified by the user.
 */
Meteor.methods({
  'Profiles.update'({ email, firstName, lastName, bio, title, picture, interests, projects, roleAdmin }) {
    Profiles.collection.update({ email }, { $set: { email, firstName, lastName, bio, title, picture } });
    ProfilesInterests.collection.remove({ profile: email });
    ProfilesProjects.collection.remove({ profile: email });
    interests.map((interest) => ProfilesInterests.collection.insert({ profile: email, interest }));
    projects.map((project) => ProfilesProjects.collection.insert({ profile: email, project }));
    // Update the role if it has changed
    const userId = Meteor.users.findOne({ username: email })._id;
    if (roleAdmin) {
      // TODO: Move to server-side method
      if (Meteor.isServer) {
        Roles.addUsersToRoles(userId, 'admin');
      }
    } else {
      Roles.removeUsersFromRoles(userId, 'admin');
    }
  },
});
const addProjectMethod = 'Projects.add';

/** Creates a new project in the Projects collection, and also updates ProfilesProjects and ProjectsInterests. */
Meteor.methods({
  'Projects.add'({ name, description, picture, interests, participants, homepage, date, students, video, testimonials, techStack, instructor, image, poster, statuses }) {
    if (Projects.collection.findOne({ name })) {
      throw new Meteor.Error(`Project ${name} already exists. Choose a unique project name.`);
    }
    Projects.collection.insert({ name, description, picture, homepage, date, students, video, testimonials, techStack, instructor, image, poster });
    ProfilesProjects.collection.remove({ project: name });
    ProjectsInterests.collection.remove({ project: name });
    if (interests) {
      interests.map((interest) => ProjectsInterests.collection.insert({ project: name, interest }));
    } else {
    //  throw new Meteor.Error('At least one interest is required.');
    }
    if (participants) {
      participants.map((participant) => ProfilesProjects.collection.insert({ project: name, profile: participant }));
    }
    ProjectsStatuses.collection.remove({ project: name });
    if (statuses && statuses.length) {
      statuses.map((statusItem) => ProjectsStatuses.collection.insert({ project: name, status: statusItem }));
      //  ProjectsStatuses.collection.insert({ project: name, status });
    } else {
      //  throw new Meteor.Error('At least one project status is required.');
      ProjectsStatuses.collection.insert({ project: name, status: 'Proposed' });
    }
  },
});
const updateProjectMethod = 'Projects.update';
/** Updates a project in the Projects collection, and also updates ProfilesProjects and ProjectsInterests. */
Meteor.methods({
  'Projects.update'({ name, description, picture, interests, participants, homepage, date, students, video, testimonials, techStack, instructor, image, poster, statuses }) {
    Projects.collection.update({ name }, { $set: { name, description, picture, homepage, date, students, video, testimonials, techStack, instructor, image, poster } });

    // ProfilesProjects.collection.remove({ project: name });
    // ProjectsInterests.collection.remove({ project: name });
    ProjectsStatuses.collection.remove({ project: name });
    if (interests) {
      // interests.map((interest) => ProjectsInterests.collection.insert({ project: name, interest }));
    } else {
      //  throw new Meteor.Error('At least one interest is required.');
    }
    if (participants) {
      // participants.map((participant) => ProfilesProjects.collection.insert({ project: name, profile: participant }));
    }
    ProjectsStatuses.collection.remove({ project: name });
    if (statuses && statuses.length) {
      statuses.map((statusItem) => ProjectsStatuses.collection.insert({ project: name, status: statusItem }));
      //  ProjectsStatuses.collection.insert({ project: name, status });
    } else {
      //  throw new Meteor.Error('At least one project status is required.');
      ProjectsStatuses.collection.insert({ project: name, status: 'Proposed' });
    }
  },
});
const addCommentMethod = 'Comments.add';

/** Creates a new project in the Projects collection, and also updates ProfilesProjects and ProjectsInterests. */
Meteor.methods({
  'Comments.add'({ name, comment, userId, createdAt }) {
    Comments.collection.insert({ name, comment, userId, createdAt });
  },
});

export { updateProfileMethod, addProjectMethod, updateProjectMethod, addCommentMethod };
