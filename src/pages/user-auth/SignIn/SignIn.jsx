import React from 'react';

import { Navigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';

import authClient from 'api/auth';
import SpinLoader from 'components/SpinLoader/SpinLoader';
import ErrorBox from 'components/ErrorBox/ErrorBox';

import './SignIn.scss';

import { __ls_set_access_token, __ls_set_refresh_token } from 'helpers/localStorageHelpers';
import { log, error } from 'helpers/logger';

export default class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            submitted: false,
            errors: null,
            redirect: false,
        }
    }

    usernameChangeHandler(newUsername) {
        this.setState({ username: newUsername })
    }
    passwordChangeHandler(newPassword) {
        this.setState({ password: newPassword })
    }
    updateSubmitted(bool) {
        this.setState({ submitted: bool })
    }
    updateErrors(newErrors) {
        this.setState({ errors: newErrors })
    }

    submitHandler(e) {
        e.preventDefault();
        if (this.state.submitted) {
            log('Already submitted. Please wait for response.');
            return false;
        }
        this.updateSubmitted(true);

        const data = this.state;
        const parent = this;
        toast.promise(
            authClient.signIn(data)
            ,{
                pending: {
                    render(){ return 'Signing in...' },
                },
                success: {
                    render({data}){ 
                        __ls_set_access_token(data.data.access)
                        __ls_set_refresh_token(data.data.refresh)
                        parent.setState({ redirect: true });
                        return 'Welcome back.'; 
                    },
                },
                error: {
                    render({data}){ 
                        parent.updateErrors(data.response.data);
                        return 'Sign-in Failed!';
                    }
                }
            }
        ).finally(() => this.updateSubmitted(false))
    }

    render() {
        const { errors, redirect } = this.state;
        const LEFT_COL = 3;
        const RIGHT_COL = 12 - LEFT_COL;

        if (redirect)
            return <Navigate to='/profile' />

        return (
            <Form className="sign-in-form" onSubmit={(e) => this.submitHandler(e)}>
                <fieldset className="disabled-on-submit-wrapper" disabled={this.state.submitted}>
                    <h4>Sign In</h4>
                    <ErrorBox errors={errors} />
                    <Form.Group as={Row} className="m-3" controlId="formPlaintextUsername">
                        <Form.Label column sm={LEFT_COL} className="required">
                            Username
                        </Form.Label>
                        <Col sm={RIGHT_COL}>
                            <Form.Control type="input" placeholder="Enter your Username" required
                                onChange={(e) => this.usernameChangeHandler(e.target.value)}
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="m-3" controlId="formPlaintextPassword">
                        <Form.Label column sm={LEFT_COL} className="required">
                            Password
                        </Form.Label>
                        <Col sm={RIGHT_COL}>
                            <Form.Control type="password" placeholder="Enter your Password" required
                                onChange={(e) => this.passwordChangeHandler(e.target.value)}
                            />
                        </Col>
                    </Form.Group>
                    <div className="d-inline">
                        <Button variant="dark" className="submit-btn" type="submit">
                            {"Sign In"}
                        </Button>
                        {this.state.submitted ? <SpinLoader size={20} margin="0 10px" /> : <></>}
                    </div>
                </fieldset>
            </Form>
        )
    }
}