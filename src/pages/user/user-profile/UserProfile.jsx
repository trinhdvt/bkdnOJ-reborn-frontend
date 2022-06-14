import React from 'react';
import { connect } from 'react-redux';
import { updateUser, clearUser } from 'redux/User/actions';
import { updateProfile } from 'redux/Profile/actions';

import { Row, Col, Container } from 'react-bootstrap';

import profileClient from 'api/profile';
import { log } from 'helpers/logger';

import SpinLoader from 'components/SpinLoader/SpinLoader';

import './UserProfile.scss';
import { __ls_set_auth_user, __ls_get_access_token } from 'helpers/localStorageHelpers';
import { setTitle } from 'helpers/setTitle';

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: this.props.profile,
      loaded: false,
    }
    this.user = this.props.user;
    setTitle('Profile')
  }

  fetch() {
    const profile = this.state.profile;
    // Sometimes the Token hasn't been set yet, so it causes profile
    // to not properly loaded.
    // We waited for 2s...
    setTimeout(() => profileClient.fetchProfile().then((res) => {
      this.setState({
        profile: res.data,
        loaded: true,
      })
      this.props.updateUser({...res.data.owner, avatar: res.data.avatar});
      this.props.updateProfile({ ...res.data, });
    }).catch((err) => {
      console.log(err);
    }), 1000); // TODO: remove this number
  }

  componentDidMount() {
    this.fetch();
  }

  render() {
    const {profile, loaded} = this.state;

    return (
      <Container className='user-profile shadow rounded'>
        <h4>User Profile</h4>
        {
          !loaded && <SpinLoader className='user-profile-loader'/>
        }
        {
          loaded && !profile
          && <Row>
            <Col className='center p-3'>
              <h5 className='pt-2'>Not logged in.</h5>
            </Col>
          </Row>
        }
        {
          loaded && !!profile
          && <Row>
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
    profile: state.profile.profile,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateUser: (user) => dispatch(updateUser({user: user})),
    updateProfile: (profile) => dispatch(updateProfile({profile: profile})),
    clearUser: () => dispatch(clearUser()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
