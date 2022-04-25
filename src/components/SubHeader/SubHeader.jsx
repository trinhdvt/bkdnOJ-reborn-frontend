import React from 'react';
import './SubHeader.scss';
import { Container } from 'react-bootstrap';

class SubHeader extends React.Component {
    render() {
        return (
            <div className='subheader expand-sm'>
                <Container>
                    <div className='float-left'>
                        <span className='left-padder d-none d-md-inline'>
                            {'▶▶'}
                        </span>
                        <span className=''>This Is</span>
                        <span>Float Left</span>
                        <span>Components</span>
                    </div>
                    <div className='float-right'>
                        <span>Float Right</span>
                    </div>
                </Container>
            </div>
        )
    }
}

export default SubHeader;