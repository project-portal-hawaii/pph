import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Landing from '../pages/Landing';
import NotFound from '../pages/NotFound';
import SignUp from '../pages/SignUp';
import SignOut from '../pages/SignOut';
import NavBar from '../components/NavBar';
import SignIn from '../pages/SignIn';
import NotAuthorized from '../pages/NotAuthorized';
import Profiles from '../pages/Profiles';
import Interests from '../pages/Interests';
import EditProfile from '../pages/EditProfile';
import Filter from '../pages/Filter';
import AddProject from '../pages/AddProject';
import AvailableProjects from '../pages/AvailableProjects';
import SingleProject from '../pages/SingleProject';
import ShowcaseProjectsPage from '../pages/ShowcaseProjects';
import ProjectsAdmin from '../pages/ProjectsAdmin';
import EditProject from '../pages/EditProject';
import EditProfileAdmin from '../pages/EditProfileAdmin';
import ProfilesAdmin from '../pages/ProfilesAdmin';
import LoadingSpinner from '../components/LoadingSpinner';
/* Top-level layout component for this application. Called in imports/startup/client/startup.jsx. */
const App = () => {
  const { ready } = useTracker(() => {
    const rdy = Roles.subscription.ready();
    return {
      ready: rdy,
    };
  });
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <NavBar />
        <Routes>
          <Route exact path="/" element={<Landing />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signout" element={<SignOut />} />
          <Route path="/interests" element={<Interests />} />
          <Route path="/profiles" element={<Profiles />} />
          <Route path="/profilesadmin" element={<AdminProtectedRoute ready={ready}><ProfilesAdmin /></AdminProtectedRoute>} />
          <Route path="/singleproject" element={<SingleProject />} />
          <Route path="/availableprojects" element={<AvailableProjects />} />
          <Route path="/showcaseprojects" element={<ShowcaseProjectsPage />} />
          <Route path="/allprojects" element={<AdminProtectedRoute ready={ready}><ProjectsAdmin /></AdminProtectedRoute>} />
          <Route path="/editprofile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
          <Route path="/editprofileadmin/:_id" element={<AdminProtectedRoute ready={ready}><EditProfileAdmin /></AdminProtectedRoute>} />
          <Route path="/editproject/:_id" element={<AdminProtectedRoute ready={ready}><ProtectedRoute><EditProject /></ProtectedRoute></AdminProtectedRoute>} />
          <Route path="/filter" element={<ProtectedRoute><Filter /></ProtectedRoute>} />
          <Route path="/addproject" element={<ProtectedRoute><AddProject /></ProtectedRoute>} />
          <Route path="/notauthorized" element={<NotAuthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

/*
 * ProtectedRoute (see React Router v6 sample)
 * Checks for Meteor login before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const ProtectedRoute = ({ children }) => {
  const isLogged = Meteor.userId() !== null;
  return isLogged ? children : <Navigate to="/signin" />;
};

/**
 * AdminProtectedRoute (see React Router v6 sample)
 * Checks for Meteor login and admin role before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const AdminProtectedRoute = ({ ready, children }) => {
  const isLogged = Meteor.userId() !== null;
  if (!isLogged) {
    return <Navigate to="/signin" />;
  }
  if (!ready) {
    return <LoadingSpinner />;
  }
  const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
  return (isLogged && isAdmin) ? children : <Navigate to="/notauthorized" />;
};
// Require a component and location to be passed to each ProtectedRoute.
ProtectedRoute.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};

ProtectedRoute.defaultProps = {
  children: <Landing />,
};

// Require a component and location to be passed to each AdminProtectedRoute.
AdminProtectedRoute.propTypes = {
  ready: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};

AdminProtectedRoute.defaultProps = {
  ready: false,
  children: <Landing />,
};
export default App;
