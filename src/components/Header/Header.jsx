import React from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import flag from 'assets/images/bkdnoj-dropflag.png';
import './Header.scss';

export default class Header extends React.Component {
    render() {
        return (
            <div className='header'>
                <Container>
                    <div className='site-logo d-none d-md-block'>
                        <Link to="/">
                            <img src={flag} alt="Drop down Flag with BKDN icon and Online Judge text" />
                        </Link>
                    </div>
                    <span>version ALPHA</span>
                    <span>🇻🇳 Tiếng Việt</span>
                    <span>🇬🇧 English</span>
                    <span>?</span>
                </Container>
            </div>
        )
    }
}
