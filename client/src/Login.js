import { Form, Button, Col, Container, Alert, Row } from 'react-bootstrap';
import { useState } from 'react';
import { Link } from 'react-router-dom';

//import { Redirect } from 'react-router';

function LoginForm(props) {
    const [username, setUsername] = useState('student@studenti.polito.it');
    const [password, setPassword] = useState('student');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrorMessage('');
        const credentials = { username: username, password: password };

        // SOME VALIDATION, ADD MORE!!!
        let valid = true;
        if (username === '' || password === '' || password.length < 6)
            valid = false;

        if (valid) {
            props.login(credentials);
        }
        else {
            // show a better error message...
            setErrorMessage('Error(s) in the form, please fix it.')
        }
    };

    return (

        <Container fluid className="vh-100 p-5" >
            <Row className="justify-content-md-center">
                <Form>
                    {errorMessage ? <Alert variant='danger'>{errorMessage}</Alert> : ''}
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" value={username} onChange={ev => setUsername(ev.target.value)} />
                        <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" value={password} onChange={ev => setPassword(ev.target.value)} />
                    </Form.Group>
                    <Button variant="primary" type="submit" onClick={handleSubmit}>
                        Submit
                    </Button>
                    {/* <Link to="/surveys">
                    <Button variant="primary" >
                        Entra come visualizzatore
                    </Button>
                </Link> */}

                </Form>
            </Row>
        </Container>

    )
}

function LogoutButton(props) {
    return (
        <Col>
            <Button variant="outline-light" onClick={props.logout} className="mt-1" >Logout</Button>
        </Col>
    )
}

function LoginButton(props) {
    return (
        <Col>
            <Link to="/login"><Button variant="outline-light" className="mt-1" >Login</Button></Link>
        </Col>
    )
}

export { LoginForm, LogoutButton, LoginButton };