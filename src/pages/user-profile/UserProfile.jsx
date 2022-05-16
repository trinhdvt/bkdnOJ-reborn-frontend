import React from 'react';
import { connect } from 'react-redux';
import { updateUser, clearUser } from 'redux/User/actions';

import { Row, Col, Container } from 'react-bootstrap';

import profileClient from 'api/profile';
import { log } from 'helpers/logger';

import SpinLoader from 'components/SpinLoader/SpinLoader';
import './UserProfile.scss';
import { __ls_set_auth_user } from 'helpers/localStorageHelpers';
import { setTitle } from 'helpers/setTitle';

class UserProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            profile: {},
            loaded: false,
        }
        setTitle('Profile')
    }

    componentDidMount() {
        const parent = this;
        profileClient.fetchProfile().then((res) => {
            parent.setState({
                profile: res.data,
                loaded: true,
            })
            __ls_set_auth_user(res.data.owner);
            this.props.updateUser({...res.data.owner, avatar: res.data.avatar});
        }).catch((err) => {
            log(err);
        })

    }
    render() {
        const {profile, loaded} = this.state;

        return (
            <Container className='user-profile shadow rounded'>
                <h4>User Profile</h4>
                {
                    !loaded
                    ? <SpinLoader className='user-profile-loader'/>
                    : <Row>
                        <Col md={4} className='center p-3'>
                            <img src={profile.avatar} className='avatar img-fluid'
                                alt={`User ${profile.owner.username}'s avatar`}/>
                            <h5 className='pt-2'>{profile.owner.username}</h5>
                        </Col>
                        <Col md={8} className='p-3 text-left'>
                            <div className='section'>
                                <span className='d-inline'>
                                    <span className='section-title'> Name: </span>
                                    <span className='section-content'> {`${profile.first_name} ${profile.last_name}`}</span>
                                </span>
                            </div>
                            <div className='section'>
                                <div className='d-box text-left'>
                                    <div className='section-title'> Description: </div>
                                    <div className='section-content'> {profile.description} </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                }
            </Container>
        )
    }
};

const mapStateToProps = state => {
  return {
    user: state.user.user,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateUser: (user) => dispatch(updateUser({user: user})),
    clearUser: () => dispatch(clearUser()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);