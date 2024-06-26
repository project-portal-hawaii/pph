import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';
import { NavLink } from 'react-router-dom';
import { Container, Image, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { BoxArrowRight, PersonFill, PersonPlusFill } from 'react-bootstrap-icons';
import { ComponentIDs } from '../utilities/ids';

const NavBar = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { currentUser, loggedIn, isAdmin } = useTracker(() => ({
    currentUser: Meteor.user() ? Meteor.user().username : '',
    loggedIn: !!Meteor.user(),
    isAdmin: Roles.userIsInRole(Meteor.userId(), 'admin'),
  }), []);
  const menuStyle = { marginBottom: '0px' };
  const navbarClassName = loggedIn ? 'bg-dark' : 'bg-light';
  return (
    <Navbar expand="lg" style={menuStyle} className={navbarClassName}>
      <Container>
        <Navbar.Brand as={NavLink} to="/" key="landing" className="align-items-center">
          <span style={{ fontWeight: 800, fontSize: '24px' }}><Image src="/images/logo.png" width={50} style={{ marginBottom: 3 }} /> Project Portal Hawaiʻi</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls={ComponentIDs.basicNavbarNav} />
        <Navbar.Collapse id={ComponentIDs.basicNavbarNav}>
          <Nav className="me-auto justify-content-start">
            {/* <Nav.Link as={NavLink} id={ComponentIDs.landingMenuItem} to="/" key="landing">Home</Nav.Link> */}
            {/* <Nav.Link as={NavLink} id={ComponentIDs.profilesMenuItem} to="/profiles" key="profiles">Profiles</Nav.Link> */}
            {(currentUser && isAdmin) ? ([<Nav.Link as={NavLink} id={ComponentIDs.allProjectsMenuItem} to="/allprojects" key="allP">All Projects</Nav.Link>]) : ''}
            <Nav.Link as={NavLink} id={ComponentIDs.projectsMenuItem} to="/availableprojects" key="availableprojects">Available Projects</Nav.Link>
            {/* <Nav.Link as={NavLink} id={ComponentIDs.interestsMenuItem} to="/interests" key="interests">Interests</Nav.Link> */}
            <Nav.Link as={NavLink} id={ComponentIDs.showcaseMenuItem} to="/showcaseprojects" key="showcaseprojects">Showcase</Nav.Link>
            {currentUser ? ([<Nav.Link as={NavLink} id={ComponentIDs.singleProjectMenuItem} to="/singleProject" key="singleProject">Random Project</Nav.Link>]) : ''}
            {currentUser ? ([<Nav.Link as={NavLink} id={ComponentIDs.addProjectMenuItem} to="/addProject" key="addP">Add Project</Nav.Link>]) : ''}
            { /* <Nav.Link as={NavLink} id={ComponentIDs.filterMenuItem} to="/filter" key="filter">Filter</Nav.Link>] */ }
            {(currentUser && isAdmin) ? ([<Nav.Link as={NavLink} id={ComponentIDs.profilesMenuItem} to="/profilesadmin" key="profiles">Profiles</Nav.Link>]) : ''}
            {(currentUser && !isAdmin) ? ([<Nav.Link as={NavLink} id={ComponentIDs.homeMenuItem} to="/editprofile" key="editprofile">Edit Profile</Nav.Link>]) : ''}
          </Nav>
          <Nav className="justify-content-end">
            {currentUser === '' ? (
              <NavDropdown id={ComponentIDs.loginDropdown} title="Login">
                <NavDropdown.Item id={ComponentIDs.loginDropdownSignIn} as={NavLink} to="/signin">
                  <PersonFill />
                  Sign
                  in
                </NavDropdown.Item>
                <NavDropdown.Item id={ComponentIDs.loginDropdownSignUp} as={NavLink} to="/signup">
                  <PersonPlusFill />
                  Sign
                  up
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <NavDropdown id={ComponentIDs.currentUserDropdown} title={currentUser}>
                <NavDropdown.Item id={ComponentIDs.currentUserDropdownSignOut} as={NavLink} to="/signout">
                  <BoxArrowRight />
                  {' '}
                  Sign
                  out
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
