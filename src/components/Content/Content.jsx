import React from 'react';
import {Container} from 'react-bootstrap';
import "./Content.scss";

export default class Content extends React.Component {
    render() {
        return (
            <Container className="content">
                Content goes here.
            </Container>
        )
    }
}