import { Form, Button, Col, Container, Alert, Row } from 'react-bootstrap';
import { useState } from 'react';

//import { Redirect } from 'react-router';

function LoginForm(props) {
    const [username, setUsername] = useState('Michele');
    const [password, setPassword] = useState('student');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrorMessage('');
        const credentials = { username: username, password: password };

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
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="username" placeholder="Enter username" value={username} onChange={ev => setUsername(ev.target.value)} />
                        <Form.Text className="text-muted">
                            We'll never share your username with anyone else.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" value={password} onChange={ev => setPassword(ev.target.value)} />
                    </Form.Group>
                    <Button variant="primary" type="submit" onClick={handleSubmit}>
                        Submit
                    </Button>
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
            <Button variant="outline-light" className="mt-1" >Login</Button>
        </Col>
    )
}

export { LoginForm, LogoutButton, LoginButton };