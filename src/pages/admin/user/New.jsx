import React from 'react';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { Form, Row, Col, Button, Tabs, Tab } from 'react-bootstrap';
import { FaRegTrashAlt } from 'react-icons/fa';
import { VscRefresh } from 'react-icons/vsc';

import { withParams } from 'helpers/react-router'
import UserFromFile from './newtabs/UserFromFile';
import { setTitle } from 'helpers/setTitle';

import "./Details.scss";

class AdminJudgeDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false, errors: null,
      data: undefined,
      redirectUrl: null,
    };
  }

  setRedirect(url) { this.setState({ redirectUrl: url })}

  componentDidMount() {
    setTitle(`Admin | Users`)
  }

  render() {
    if (this.state.redirectUrl)
      return ( <Navigate to={`${this.state.redirectUrl}`} /> )

    const {loaded, errors, data} = this.state;

    return (
      <div className="admin user-panel wrapper-vanilla">
        <h4 className="user-title">
          <div className="panel-header">
            <span className="title-text">+ Creating User</span>
            <span>
            </span>
          </div>
        </h4>
        <hr/>
        <div className="user-details">
          <Tabs defaultActiveKey="upload" id="new-user-tabs" className="pl-2">
            <Tab eventKey="upload" title="Upload CSV" >
              <UserFromFile redirectTo={(url) => this.setRedirect(url)}/>
            </Tab>
            {/* <Tab eventKey="form" title="Form">
              <span> Not implemented </span>
            </Tab>
            <Tab eventKey="macros" title="Macros">
              <span> Not implemented </span>
            </Tab> */}
          </Tabs>
        </div>
      </div>
    )
  }
}

let wrappedPD = AdminJudgeDetails;
wrappedPD = withParams(wrappedPD);
const mapStateToProps = state => {
    return { user : state.user.user }
}
wrappedPD = connect(mapStateToProps, null)(wrappedPD);
export default wrappedPD;
