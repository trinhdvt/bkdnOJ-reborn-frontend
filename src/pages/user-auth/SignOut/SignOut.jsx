import React from 'react';

import { Navigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';

import SpinLoader from 'components/SpinLoader/SpinLoader';
import ErrorBox from 'components/ErrorBox/ErrorBox';

import './SignOut.scss';

import { __ls_remove_credentials, __ls_set_access_token, __ls_set_refresh_token } from 'helpers/localStorageHelpers';
import { log, error } from 'helpers/logger';

export default class SignOut extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            submitted: false,
            errors: null,
            redirect: false,
        }
    }

    updateSubmitted(bool) {
        this.setState({submitted: bool});
    }

    componentDidMount() {
    }

    render() {
        const { errors, redirect } = this.state;
        if (redirect)
            return <Navigate to='/' />

        return (
            <Form className="sign-out-form">
                <h5>Signing Out <SpinLoader/></h5>
            </Form>
        )
    }
}