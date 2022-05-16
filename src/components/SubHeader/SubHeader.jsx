import React from 'react';
import './SubHeader.scss';
import { Container } from 'react-bootstrap';

class SubHeader extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            curTime : new Date().toLocaleString(),
        }
    }
    componentDidMount() {
        this.timer = setInterval(() => { 
            this.setState({
                curTime : new Date().toLocaleString()
            })
        }, 1000)
    }
    componentWillUnmount() {
        clearInterval(this.timer)
    }

    render() {
        return (
            <div className='subheader expand-sm'>
                <Container>
                    <div className='float-left'>
                        <span className='left-padder d-none d-md-inline'>
                            {'▶▶'}
                        </span>
                        {/* <span>This Is</span>
                        <span>Float Left</span>
                        <span>Components</span> */}
                    </div>
                    <div className='float-right'>
                        <span>{this.state.curTime}</span>
                    </div>
                </Container>
            </div>
        )
    }
}

export default SubHeader;