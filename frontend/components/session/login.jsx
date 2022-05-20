import React from 'react';
import { Redirect } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';


class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: '',
            // login form variables
            successfulLogin: false,
            validUsername: true,
            checkedUsername: false,
            usernameErrorMsg: '',
            validPassword: true,
            checkedPassword: false,
            passwordErrorMsg: ''
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateForm = this.validateForm.bind(this);
    }


    handleInput(type) {
        return (e) => {
            this.setState({ [type]: e.target.value });
        };
    }


    validateForm() {
        // check if entered username or password is blank
        const validUsername = this.state.username.length > 0;
        const validPassword = this.state.password.length > 0;
        let usernameErrorMsg = '';
        let passwordErrorMsg = '';

        if (!validUsername) {
            usernameErrorMsg = 'Username cannot be blank';
        }
        if (!validPassword) {
            passwordErrorMsg = 'Password cannot be blank';
        }

        this.setState({
            validUsername: validUsername,
            checkedUsername: true,
            usernameErrorMsg: usernameErrorMsg,
            validPassword: validPassword,
            checkedPassword: true,
            passwordErrorMsg: passwordErrorMsg
        });

        return validUsername && validPassword;
    }


    handleSubmit(e) {
        // override default action from the form
        e.preventDefault();

        const validFormInputs = this.validateForm();

        if (!validFormInputs) {
            e.stopPropagation();
        }
        else {
            // send request to log in
            this.props.loginUser({
                username: this.state.username,
                password: this.state.password
            }
            ).then(() => {
                // collect error messages
                const errors = this.props.errors;
                console.log(errors);

                const successfulLogin = Object.keys(errors).length == 0;
                if (successfulLogin) {
                    // record successful login and return
                    this.setState({
                        successfulLogin: true
                    });
                }
                else {
                    // handle errorss
                    Object.keys(errors).forEach(k => {
                        switch (k) {

                            case "username":
                                let usernameErrorMsg = 'Username ' + errors['username'][0];
                                for (let i = 1; i < errors['username'].length; ++i) {
                                    usernameErrorMsg.concat(', ' + errors['username'][i]);
                                }
                                this.setState({ usernameErrorMsg: usernameErrorMsg, validUsername: false });
                                break;

                            case "password":
                                let passwordErrorMsg = 'Password ' + errors['password'][0];
                                for (let i = 1; i < errors['password'].length; ++i) {
                                    passwordErrorMsg.concat(', ' + errors['password'][i]);
                                }
                                this.setState({ passwordErrorMsg: passwordErrorMsg, validPassword: false });
                                break;
                        }
                    });
                }
            });
        }
    }


    render() {

        // Redirect to hompage after successful login
        if (this.state.successfulLogin) {
            return <Redirect to="/homepage" />
        }

        return (
            <Container
                className="login-form"
            >
                <h2 className="form-heading">Log In</h2>
                <Form
                    noValidate
                    onSubmit={this.handleSubmit}
                >
                    <Row>
                        <Form.Group
                            as={Row}
                            md
                            controlId="validationUsername"
                        >
                            <Form.Label column md>Username:</Form.Label>
                            <Col>
                                <Form.Control
                                    type="text"
                                    isInvalid={!this.state.validUsername}
                                    isValid={this.state.checkedUsername && this.state.validUsername}
                                    value={this.state.username}
                                    onChange={this.handleInput('username')}
                                />
                                <Form.Control.Feedback
                                    type="invalid"
                                >{this.state.usernameErrorMsg}</Form.Control.Feedback>
                            </Col>
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group
                            as={Row}
                            md
                            controlId="validationPassword"
                        >
                            <Form.Label column md>Password:</Form.Label>
                            <Col>
                                <Form.Control
                                    type="password"
                                    isInvalid={!this.state.validPassword}
                                    isValid={this.state.checkedPassword && this.state.validPassword}
                                    value={this.state.password}
                                    onChange={this.handleInput('password')}
                                />
                                <Form.Control.Feedback
                                    type="invalid"
                                >{this.state.passwordErrorMsg}</Form.Control.Feedback>
                            </Col>
                        </Form.Group>
                    </Row>
                    <Button
                        type="submit"
                    >Log in</Button>
                </Form>
            </Container>
        );
    }
}

export default Login;
