import React, { useState, useEffect } from "react";
import { Container, Nav, Navbar } from 'react-bootstrap';
import './NavbarComp.css';
import * as suiteIcons from "@rsuite/icons";
import "rsuite/dist/rsuite.min.css";

const NavbarComp = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'token' && !event.newValue) {
        window.location.reload();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <Navbar bg="light" variant={"light"} expand="lg">
      <Container fluid>
        <Navbar.Brand href="/">Yummy Tummy</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll>
            <Nav.Link href="/"><suiteIcons.Dashboard /> Home</Nav.Link>
            {isLoggedIn && (
              <Nav.Link href="/AddRecipe">
                <suiteIcons.AddOutline /> Add Recipe
              </Nav.Link>
            )}
            <Nav.Link href="/SearchRecipe"><suiteIcons.Search /> Search Recipe</Nav.Link>
          </Nav>
          {isLoggedIn ? (
            <Nav.Link href="/">
              <suiteIcons.OperatePeople /> Logged in as XYZ
            </Nav.Link>
          ) : (
            <>
              <Nav.Link href="/register">Sign Up</Nav.Link>
              <Nav.Link href="/login">Sign In</Nav.Link>
            </>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComp;