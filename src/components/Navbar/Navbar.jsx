import React from 'react';
import BTNavbar from 'react-bootstrap/Navbar';
import { Container, Nav, NavDropdown, Item, Image } from 'react-bootstrap';
import icon from 'assets/images/bkdnoj-favicon-noring.png';

import './Navbar.scss'

export default class Navbar extends React.Component {
    render() {
        return (
            <BTNavbar bg="light" expand="md" className="navbar py-0" id="navbar" fixed="top">
                <Container>
                    <BTNavbar.Brand id="brand" href="#home">
                        <Image src={icon} id="site-brand"/>
                        <span>bkdnOJ</span>
                    </BTNavbar.Brand>

                    <BTNavbar.Toggle aria-controls="basic-navbar-nav"/>
                    <BTNavbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="#post">Post</Nav.Link>
                            <Nav.Link href="#problem">Problem</Nav.Link>
                            <NavDropdown title="Contests" id="basic-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1">Upcoming</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">Ongoing</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">Past</NavDropdown.Item>
                            </NavDropdown>
                            <Nav.Link href="#organization">Organization</Nav.Link>
                            <Nav.Link href="#user">User</Nav.Link>
                        </Nav>
                    </BTNavbar.Collapse>
                </Container>
            </BTNavbar>
        )
    }
}
