import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LoginButton, LogoutButton } from './Login';


function MyNavBar(props) {
    return (
        <Navbar bg="primary" variant="dark" expand="lg">
            <Link to={props.loggedIn ? "/home" : "/"}>
                <Navbar.Brand >
                    <img className="radius" src="/LogoMemeGenerator.jpg" alt="Logo" width={50} height={50} />
                    <strong className="pl-2">MeMe GENerAtOR</strong>
                </Navbar.Brand>
            </Link>
            <Nav className="ml-md-auto  ">
                <Container className="d-flex">
                    <Nav.Item >
                        <img src="https://img.icons8.com/small/32/ffffff/user-male-circle.png" alt="profile" />
                    </Nav.Item>
                    <Nav.Item>
                        {props.loggedIn ? <Link to="/" ><LogoutButton logout={props.logout} > </LogoutButton></Link> :
                            <Link to="/login" ><LoginButton logout={props.logout}> </LoginButton></Link>}
                    </Nav.Item>
                </Container>
            </Nav>
        </Navbar>

    )
}

export default MyNavBar;
