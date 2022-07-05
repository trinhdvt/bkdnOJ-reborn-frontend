import React from 'react';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import { updateUser, clearUser } from 'redux/User/actions';
import { updateProfile } from 'redux/Profile/actions';

import { Link } from 'react-router-dom';
import { Row, Col, Tabs, Tab } from 'react-bootstrap';

import { FaUniversity } from 'react-icons/fa';

import profileClient from 'api/profile';
import { log } from 'helpers/logger';

import SpinLoader from 'components/SpinLoader/SpinLoader';
import { Navigate } from 'react-router-dom';

class CompeteTab extends React.Component {
  render() {
    const { profile } = this.props;

    return (
      <p>Compete</p>
    )
  }
}

export default CompeteTab;
