import React from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { Redirect } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext'

class LoginPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = { email: '', password: '', submitted: false };
    }

    onChangeEmail = (event) => {
        this.setState({ email: event.target.value });
    };

    onChangePassword = (event) => {
        this.setState({ password: event.target.value });
    };

    handleSubmit = async (event, onLogin) => {
        event.preventDefault();
        await onLogin(this.state.email, this.state.password);
        this.setState({ submitted: true });
    }

    render() {
        if (this.state.submitted)
            return <Redirect to='/' />;
        return (
            <AuthContext.Consumer>
                {(context) => (
                    <Modal
                        show={true}
                        size="md"
                        onHide={()=>{}}
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                    >
                        <Modal.Header>
                            <Modal.Title id="contained-modal-title-vcenter">
                                Login
                        </Modal.Title>
                        </Modal.Header>
                        <Form onSubmit={(event) => this.handleSubmit(event, context.loginUser)}>
                            <Modal.Body>
                                {context.authErr &&
                                    <Alert variant="danger">
                                        {context.authErr}
                                    </Alert>
                                }
                                <Form.Group controlId="email">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" name="email" placeholder="Email" value={this.state.email} onChange={this.onChangeEmail} required autoFocus />
                                </Form.Group>
                                <Form.Group controlId="password">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" name="password" placeholder="Password" value={this.state.password} onChange={this.onChangePassword} required />
                                </Form.Group>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button block type="submit" variant="primary">Login</Button>
                            </Modal.Footer>
                        </Form>
                    </Modal>

                )}
            </AuthContext.Consumer>
        );
    }


}

export default LoginPage;
