import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Navbar, Nav,Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';


function MyNavBar(props) {
    return (
        <Navbar bg="primary" variant="dark" expand="lg">
            <Navbar.Brand href="#home">
                <img src="https://img.icons8.com/nolan/64/form.png" alt="Questionario" />
                <strong className="">MeMe GENerAtOR</strong>
            </Navbar.Brand>
            <Nav className="ml-md-auto  ">
                <Container className="d-flex">
                    <Nav.Item >
                        <img src="https://img.icons8.com/small/32/ffffff/user-male-circle.png" alt="" />
                    </Nav.Item>
                    <Nav.Item>
                        {/* {props.loggedIn ? <Link to="/login" ><LogoutButton logout={props.logout}> </LogoutButton></Link> : <Link to="/login" />}
                        {!props.loggedIn ? <Link to="/login" ><LoginButton logout={props.logout}> </LoginButton></Link> : null} */}

                    </Nav.Item>
                </Container>
            </Nav>
        </Navbar>

    )
}

export default MyNavBar;
