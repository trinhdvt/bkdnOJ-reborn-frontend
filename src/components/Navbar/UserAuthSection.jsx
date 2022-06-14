import React from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';

import { Nav, NavDropdown } from 'react-bootstrap';
import { Link, Navigate } from 'react-router-dom';

import { AiOutlineForm, AiOutlineLogin, AiOutlineLogout, AiOutlineProfile } from 'react-icons/ai';
import { GrUserAdmin } from 'react-icons/gr';

import authClient from 'api/auth';
import profileClient from 'api/profile';

import { getAdminPageUrl } from 'api/urls';
import { updateUser, clearUser } from 'redux/User/actions'
import { updateProfile, clearProfile } from 'redux/Profile/actions'
import { updateContest, clearContest } from 'redux/Contest/actions'

import { __ls_get_auth_user, __ls_remove_credentials,
        __ls_set_auth_user, } from 'helpers/localStorageHelpers';

import { log } from 'helpers/logger';


/* Redux ------------- */
const mapStateToProps = state => {
  return {
    user: state.user.user,
    profile: state.profile.profile,
    contest: state.contest.contest,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateUser: (user) => dispatch(updateUser({ user })),
    clearUser: () => dispatch(clearUser()),

    updateProfile: (profile) => dispatch(updateProfile({ profile })),
    clearProfile: () => dispatch(clearProfile()),

    updateContest: (contest) => dispatch(updateContest({ contest })),
    clearContest: () => dispatch( clearContest() ),
  }
}
/* Redux ------------- */

class AuthorizedMenu extends React.Component {
    componentDidMount() {
        profileClient.fetchProfile().then((res) => {
            __ls_set_auth_user(res.data.owner);
            this.props.updateUser({...res.data.owner, avatar: res.data.avatar});
            this.props.updateProfile({...res.data});
            this.props.updateContest(res.data.current_contest);
        }).catch((err) => {
            log(err);
        })
    }

    signOutHandler() {
        authClient.signOut()
        .then((res) => {
            this.props.clearUser();
            toast.success("See you later!");
        })
        .catch((err) => {
            __ls_remove_credentials();
        })
        .finally(() => {
            this.props.setRedirectUrl('/')
        })
    }

    render() {
        const user = this.props.user;
        return (
            <>
                <div className="nav-link" id="fake">
                    {`Hello, ${user.username}!`}
                </div>
                <NavDropdown id="nav-dropdown-userauth"
                >
                    {/* {
                        user.is_staff &&
                        <NavDropdown.Item as={Link} to="/admin" >
                            <GrUserAdmin className='react-icons' size={10} />
                            Admin
                        </NavDropdown.Item>
                    } */}
                    {
                        user.is_staff &&
                        // <NavDropdown.Item onClick={() => {
                        //     console.log(getAdminPageUrl())
                        //     window.location = getAdminPageUrl()
                        // }}>
                        <NavDropdown.Item as={Link} to="/admin">
                            <GrUserAdmin className='react-icons' size={10} />
                            Admin
                        </NavDropdown.Item>
                    }
                    <NavDropdown.Item as={Link} to="/profile">
                        <AiOutlineProfile className='react-icons' size={10} />
                        Profile
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item style={{color: 'red'}} href="#"
                        onClick={() => this.signOutHandler()}
                    >
                        <AiOutlineLogout className='react-icons' size={10} />
                        Sign Out
                    </NavDropdown.Item>
                </NavDropdown>
            </>
        )
    }
}
const ReduxAuthorizedMenu = connect(mapStateToProps, mapDispatchToProps)(AuthorizedMenu);

class UserAuthSection extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            redirect: false,
        }
        const user = (this.props.user) || __ls_get_auth_user();
        if (!!user && !this.props.user) {
            this.props.updateUser(user);
        }
    }

    render() {
        if (this.state.redirectUrl) {
            this.setState({redirectUrl: false})
            return <Navigate to={this.state.redirectUrl} />
        }

        const user = this.props.user;
        if (!user)
            return (<>
                <Nav.Link as={Link} to="/sign-up">
                    <div className="d-inline-flex align-items-center">
                        <AiOutlineForm className='react-icons' size={10} />
                        Sign Up
                    </div>
                </Nav.Link>
                <Nav.Link as={Link} to="/sign-in">
                    <div className="d-inline-flex align-items-center">
                        <AiOutlineLogin className='react-icons' size={10} />
                        Sign In
                    </div>
                </Nav.Link>
            </>)

        return <ReduxAuthorizedMenu user={user} setRedirectUrl={(url) => this.setState({redirectUrl: url})} />
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserAuthSection);
