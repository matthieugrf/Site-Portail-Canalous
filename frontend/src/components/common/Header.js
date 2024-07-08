import React from 'react';
import { Navbar, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';

const Header = () => {
  return (
    <Navbar bg="light" expand="lg" sticky="top">
      <Navbar.Brand href="/">Canalous</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/itinerary">Itinerary</Nav.Link>
          <Nav.Link href="/store">Store</Nav.Link>
          <Nav.Link href="/price-comparison">Price Comparison</Nav.Link>
          <Nav.Link href="/report-issue">Report Issue</Nav.Link>
          <NavDropdown title="Profile" id="basic-nav-dropdown">
            <NavDropdown.Item href="/profile">View Profile</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/login">Login</NavDropdown.Item>
          </NavDropdown>
        </Nav>
        <Form inline className="my-2 my-lg-0">
          <FormControl type="text" placeholder="Search" className="mr-sm-2" />
          <Button variant="outline-success">Search</Button>
        </Form>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
