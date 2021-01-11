import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { AuthContext } from '../auth/AuthContext'
import { NavLink } from 'react-router-dom';
import { Col, Container, Row } from "react-bootstrap";

const Header = (props) => {

  return (
    <AuthContext.Consumer>
      {(context) => (
        <Navbar bg="primary" variant="dark" expand="md">
          <Navbar.Toggle aria-controls="responsive-header" aria-label="Toggle sidebar"/>

          <Navbar.Brand href="/">
            PULSeBS
          </Navbar.Brand>

          <Navbar.Collapse id="responsive-header">
            <Nav className="mr-auto">
              {context.authUser && <>
                {(context.authUser.role === "teacher" || context.authUser.role === "student") &&
                <Nav.Link as={NavLink} to="/calendar">Calendar</Nav.Link>}
                {(context.authUser.role === "teacher" || context.authUser.role === "manager") &&
                <Nav.Link as={NavLink} to="/statistics">Statistics</Nav.Link>}
                {(context.authUser.role === "officer" || context.authUser.role === "manager") &&
                <Nav.Link as={NavLink} to="/setup">Setup</Nav.Link>}
              </>}
            </Nav>
            <Nav>
              <Container fluid className="px-0 mt-md-0 mt-3">
                <Row className="w-100">
                  {context.authUser &&
                  <>
                    <Col md={7} xs='auto'>
                      <Navbar.Brand as={Col} className="pl-0">
                        Welcome {context.authUser.name}!
                      </Navbar.Brand>
                    </Col>
                    <Col md={3} xs='auto' className="ml-auto pr-0">
                      <Nav.Link onClick={() => {
                        context.logoutUser()
                      }}>Logout</Nav.Link>
                    </Col>
                  </>}
                  {!context.authUser && <Col md={10} xs='auto'><Nav.Link as={NavLink} to="/login">Login</Nav.Link></Col>}
                  <Col md={{ span: 2, order: 'last'}} xs={{ span: 'auto', order: 'first' }}>
                    <Nav.Link href="#">
                      <svg className="bi bi-people-circle" width="30" height="30" viewBox="0 0 16 16"
                           fill="currentColor"
                           xmlns="https://www.w3.org/2000/svg">
                        <path
                          d="M13.468 12.37C12.758 11.226 11.195 10 8 10s-4.757 1.225-5.468 2.37A6.987 6.987 0 008 15a6.987 6.987 0 005.468-2.63z"/>
                        <path fillRule="evenodd" d="M8 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
                        <path fillRule="evenodd" d="M8 1a7 7 0 100 14A7 7 0 008 1zM0 8a8 8 0 1116 0A8 8 0 010 8z"
                              clipRule="evenodd"/>
                      </svg>
                    </Nav.Link>
                  </Col>
                </Row>
              </Container>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      )}
    </AuthContext.Consumer>

  );
}

export default Header;
