import React from 'react';
import { connect } from 'react-redux';

import {GrGlobe} from 'react-icons/gr';
import {FaUniversity, FaGlobe} from 'react-icons/fa';

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
        const {selectedOrg} = this.props;

        return (
            <div className='subheader expand-sm'>
                <Container>
                    <div className='float-left'>
                        {/* <span className='left-padder d-none d-md-inline'>
                            {'Viewing As >>'}
                        </span>
                        {selectedOrg.slug
                            ? <div className="org-display org-uni"><FaUniversity size={14}/></div>
                            : <div className="org-display org-none"><FaGlobe size={14}/></div>
                        }
                        <span>{selectedOrg.slug || "Global"}</span> */}
                    </div>

                    <div className='float-right'>
                        <span>{this.state.curTime}</span>
                    </div>
                </Container>
            </div>
        )
    }
}

const mapStateToProps = state => {
  return {
    selectedOrg: state.myOrg.selectedOrg,
  }
}

let wrapped = SubHeader;
wrapped = connect(mapStateToProps, null)(wrapped);
export default wrapped;
