import React from 'react';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { Form, Row, Col, Button, Tabs, Tab } from 'react-bootstrap';
import { FaGlobe, FaRegTrashAlt, FaChartLine } from 'react-icons/fa';

import { General, Participation, Problem, Submission
} from './_';

import contestAPI from 'api/contest';
import { SpinLoader, ErrorBox } from 'components';
import { withParams } from 'helpers/react-router'
import { setTitle } from 'helpers/setTitle';

import './Details.scss';

class RateButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rateInfo: null,
      fetchingInfo: false,
      confirmRate: false,
    }
  }

  fetchRejudgeInfo() {
    const data = { key: this.props.ckey };
    this.setState({fetchingInfo: true}, () => {
      contestAPI.infoRateContest(data)
      .then((res) => {
        let conf = window.confirm(res.data.msg + ' Proceed?');
        this.setState({ confirmRate: conf })
      })
      .catch((err) => {
        let msg = `Cannot get Rating info. (${err.response.status})`;
        if (err.response.data.detail)
          msg =  err.response.data.detail;
        toast.error(msg, {toastId: `contest-cant-rate-${msg}`})
      })
      .finally(() => this.setState({fetchingInfo: false}))
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.confirmRate === false && this.state.confirmRate === true) {
      const data = { key: this.props.ckey };
      contestAPI.rateContest(data)
        .then((res) => toast.success(`OK Rated contest ${this.props.ckey}.`))
        .catch((err) => toast.error('Cannot rate at the moment.'))
    }
  }

  clickHandler(e) {
    e.preventDefault();
    if (this.state.confirmRate) {
      alert('Please refresh if you want to re-rate this contest.');
      return;
    }
    this.fetchRejudgeInfo();
  }

  render() {
    const { fetchingInfo, confirmRate } = this.state;

    return(
      <Button className="btn-svg" size="sm"
        variant={!confirmRate ? "success" : "light"}
        onClick={(e)=>this.clickHandler(e)}>
          <FaChartLine size={16}/>
          <span className="d-none d-md-inline">
            {fetchingInfo ? <SpinLoader margin="0"/> : <>
              Rate?
            </>}
          </span>
      </Button>
    )
  }
}

class AdminContestDetails extends React.Component {
  constructor(props) {
    super(props);
    const { key } = this.props.params;
    this.key = key;
    this.state = {
      loaded: false, errors: null,
      data: undefined,
    };
  }

  refetch() {
    contestAPI.getContest({key: this.key})
      .then((res) => {
        this.setState({
          data: res.data,
          loaded: true,
        })
      }).catch((err) => {
        this.setState({
          loaded: true,
          errors: {errors: err.response.data} || `Cannot load contest. (${err.response.status})`,
        })
      })
  }

  componentDidMount() {
    setTitle(`Admin | Contest ${this.key}`)
    this.refetch();
  }

  deleteObjectHandler() {
    let conf = window.confirm("Xóa Contest này sẽ xóa TẤT CẢ tài nguyên liên quan với nó "+
      "(ContestSubmissions với Submission tương ứng, ContestParticipation, ContestProblem (nhưng không xóa Problem)). "+
      "Bạn vẫn muốn xóa?");
    if (conf) {
      contestAPI.deleteContest({key: this.key})
        .then((res) => {
          toast.success("OK Deleted.");
          this.setState({ redirectUrl : '/admin/contest/' })
        })
        .catch((err) => {
          toast.error(`Cannot delete. (${err})`);
        })
    }
  }

  render() {
    if (this.state.redirectUrl)
      return ( <Navigate to={`${this.state.redirectUrl}`} /> )

    const {loaded, errors, data} = this.state;

    return (
      <div className="admin contest-panel wrapper-vanilla">
        <h4 className="contest-title">
          <div className="panel-header">
            <span className="title-text text-truncate">{`Contest | ${this.key}`}
              { !loaded && <span><SpinLoader/></span>}
            </span>
            { loaded && !errors && <>
                <span>
                  <RateButton ckey={this.key} setErrors={(e) => this.setState({errors: e})} />
                </span>
                <span>
                  <Button className="btn-svg" size="sm" variant="dark"
                    onClick={()=>this.setState({ redirectUrl: `/contest/${this.key}` })}>
                      <FaGlobe size={16}/><span className="d-none d-md-inline">View on Site</span>
                  </Button>
                </span>
                <span>
                  <Button className="btn-svg" size="sm" variant="danger"
                    onClick={()=>this.deleteObjectHandler()}>
                      <FaRegTrashAlt size={16}/><span className="d-none d-md-inline">Delete</span>
                  </Button>
                </span>
              </>
            }
          </div>
        </h4>
        <hr/>
        <div className="contest-details">
          { !loaded && <span><SpinLoader/> Loading...</span> }
          <ErrorBox errors={this.state.errors} />
          { loaded && !errors && <>
          <Tabs defaultActiveKey="general" id="general" className="pl-2">
            <Tab eventKey="general" title="General">
              <General
                ckey={this.key} data={data} refetch={()=>this.refetch()} />
            </Tab>
            <Tab eventKey="prob" title="Problems">
              <Problem
                ckey={this.key}/>
            </Tab>
            <Tab eventKey="part" title="Participations">
              <Participation
                ckey={this.key} />
            </Tab>
            {/* <Tab eventKey="sub" title="Submissions">
              <Submission
              />
            </Tab> */}
          </Tabs>
          </> }
        </div>
      </div>
    )
  }
}

let wrappedPD = AdminContestDetails;
wrappedPD = withParams(wrappedPD);
export default wrappedPD;
// const mapStateToProps = state => {
//     return { user : state.user.user }
// }
// wrappedPD = connect(mapStateToProps, null)(wrappedPD);
