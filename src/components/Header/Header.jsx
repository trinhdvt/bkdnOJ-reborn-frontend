import React from 'react';
import { Container } from 'react-bootstrap';
import flag from 'assets/images/bkdnoj-dropflag.png';
import './Header.scss';

export default class Header extends React.Component {
    render() {
        return (
            <div className='header'>
                <Container>
                    <div className='site-logo d-none d-md-block'>
                        <img src={flag} alt="Drop down Flag with BKDN icon and Online Judge text"/>
                    </div>
                    <span>🇻🇳 Tiếng Việt</span>
                    <span>🇬🇧 English</span>
                    <span>?</span>
                </Container>
            </div>
        )
    }
}
