import React from "react";

// Redux
import {connect} from "react-redux";
import {
  setContestParams,
  clearContestParams,
  setPublicParams,
  clearPublicParams,
} from "redux/SubFilter/actions";

import {NO_CONTEST_KEY} from "redux/SubFilter/types";

import {Button, Table, Row, Col} from "react-bootstrap";
import {Link} from "react-router-dom";

import {ErrorBox, SpinLoader} from "components";
import ContestContext from "context/ContestContext";

// Helpers
import {getHourMinuteSecond, getYearMonthDate} from "helpers/dateFormatter";

// Assets
import {FaTimes, FaFilter} from "react-icons/fa";

import "./SubFilterSidebar.scss";

const LANGUAGES = [
  {
    value: "C",
    name: "C",
  },
  {
    value: "C++",
    name: "C++",
  },
  {
    value: "Java",
    name: "Java",
  },
  {
    value: "Pascal",
    name: "Pascal",
  },
  {
    value: "Python",
    name: "Python",
  },
];
const VERDICTS = [
  {
    value: "AC",
    name: "Accepted",
  },
  {
    value: "WA",
    name: "Wrong Answer",
  },
  {
    value: "TLE",
    name: "Time Limit Exceeded",
  },
  {
    value: "MLE",
    name: "Memory Limit Exceeded",
  },
  {
    value: "RTE",
    name: "Runtime Error",
  },
  {
    value: "CE",
    name: "Compile Error",
  },
];
const ORDER_BY = [
  {
    value: "time",
    name: "CPU Time",
  },
  {
    value: "memory",
    name: "Memory Usage",
  },
  {
    value: "date",
    name: "Submit Time",
  },
];

class ContestSubFilterSidebar extends React.Component {
  static contextType = ContestContext;

  constructor(props) {
    super(props);
    this.state = {
      queryParams: {},
    };
  }

  setParams(key, value) {
    if (value) {
      const oldParams = this.state.queryParams;
      this.setState({queryParams: {...oldParams, [key]: value}});
    } else {
      let newParams = {...this.state.queryParams};
      delete newParams[key];
      this.setState({queryParams: newParams});
    }
  }

  onFilter() {
    const {contest} = this.context;
    if (contest)
      this.props.setContestParams(contest.key, this.state.queryParams);
    else this.props.setPublicParams(this.state.queryParams);
  }
  onClear() {
    const {contest} = this.context;
    this.setState({queryParams: {}});
    if (contest) this.props.clearContestParams(contest.key);
    else this.props.clearPublicParams();
  }

  componentDidMount() {
    const {contest} = this.context;
    if (contest)
      this.setState({
        queryParams: this.props.subFilter[contest.key] || {},
      });
    else
      this.setState({
        queryParams: this.props.subFilter[NO_CONTEST_KEY] || {},
      });
  }
  componentDidUpdate() {}

  render() {
    const {contest} = this.context;
    const {user} = this.props;

    const problems = contest.problems || [];

    const isLoggedIn = !!user;
    const isStaff = isLoggedIn && user.is_staff;
    const isSuperuser = isStaff && user.is_superuser;

    return (
      <div className="wrapper-vanilla" id="sub-filter">
        <h4>Submissions Filter</h4>
        {!contest && <span>Contest is not available.</span>}
        {!!contest && (
          <>
            <div className="flex-center-col text-left filter-panel">
              <Row>
                <Col>
                  <label
                    id="user-text-lbl"
                    className="m-0 w-100"
                    htmlFor="user-text"
                  >
                    Participant
                  </label>
                  <input
                    id="user-text"
                    className="m-0 w-100"
                    type="text"
                    onChange={e => this.setParams("user", e.target.value)}
                    value={this.state.queryParams.user || ""}
                    style={{fontSize: "12px"}}
                  ></input>
                </Col>
              </Row>
              <Row>
                <Col>
                  <label
                    id="problem-select-lbl"
                    className="m-0 w-100"
                    htmlFor="problem-select"
                  >
                    Problem
                  </label>
                  <select
                    id="problem-select"
                    className="m-0 w-100"
                    onChange={e => this.setParams("problem", e.target.value)}
                    value={this.state.queryParams.problem || ""}
                  >
                    <option key={`ct-fltr-pr-df`} value="">
                      --
                    </option>
                    {problems.map((p, idx) => (
                      <option
                        key={`ct-fltr-pr-${idx}`}
                        value={p.shortname}
                      >{`${p.label}. ${p.title}`}</option>
                    ))}
                  </select>
                </Col>
              </Row>
              <Row>
                <Col xs={4}>
                  <label
                    id="language-select-lbl"
                    className="m-0 w-100"
                    htmlFor="language-select"
                  >
                    Lang
                  </label>
                  <select
                    id="language-select"
                    className="m-0 w-100"
                    onChange={e => this.setParams("language", e.target.value)}
                    value={this.state.queryParams.language || ""}
                  >
                    <option key={`ct-fltr-ln-df`} value="">
                      --
                    </option>
                    {LANGUAGES.map((l, idx) => (
                      <option key={`ct-fltr-ln-${idx}`} value={l.value}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </Col>
                <Col xs={8}>
                  <label
                    id="verdict-select-lbl"
                    className="m-0 w-100"
                    htmlFor="verdict-select"
                  >
                    Verdict
                  </label>
                  <select
                    id="verdict-select"
                    className="m-0 w-100"
                    onChange={e => this.setParams("verdict", e.target.value)}
                    value={this.state.queryParams.verdict || ""}
                  >
                    <option key={`ct-fltr-vd-df`} value="">
                      --
                    </option>
                    {VERDICTS.map((v, idx) => (
                      <option key={`ct-fltr-vd-${idx}`} value={v.value}>
                        {v.name}
                      </option>
                    ))}
                    {isStaff && (
                      <option
                        key={`ct-fltr-vd-ie`}
                        value={"IE"}
                        className="text-danger"
                      >
                        Internal Error
                      </option>
                    )}
                  </select>
                </Col>
              </Row>
              <Row>
                <Col xs={9}>
                  <label
                    id="order-by-select-lbl"
                    className="m-0 w-100"
                    htmlFor="order-by"
                  >
                    Order By
                  </label>
                  <select
                    id="order-by"
                    className="m-0 w-100"
                    onChange={e => this.setParams("order_by", e.target.value)}
                    value={this.state.queryParams.order_by || ""}
                  >
                    <option key={`ct-fltr-ln-df`} value="">
                      --
                    </option>
                    {ORDER_BY.map((ord, idx) => (
                      <option key={`ct-fltr-ln-${idx}`} value={ord.value}>
                        {ord.name}
                      </option>
                    ))}
                  </select>
                </Col>
                <Col xs={3}>
                  <label
                    id="order-by-ordering-select-lbl"
                    className="m-0 w-100"
                    htmlFor="order-by-ordering"
                  ></label>
                  <select
                    id="order-by-ordering"
                    className="m-0 w-100"
                    onChange={e => this.setParams("dec", e.target.value)}
                    value={this.state.queryParams.dec || ""}
                  >
                    <option key={`ct-fltr-ln-asc`} value="">
                      ASC
                    </option>
                    <option key={`ct-fltr-ln-dec`} value="1">
                      DEC
                    </option>
                  </select>
                </Col>
              </Row>

              <div className="w-100 checkbox-panel" style={{columnGap: "5px"}}>
                {isLoggedIn && (
                  <label
                    id="only-me-lbl"
                    className="d-flex align-items-center m-0"
                  >
                    <input
                      type="checkbox"
                      id="only-me"
                      className="ml-1 mr-1"
                      checked={this.state.queryParams.me || false}
                      onChange={() =>
                        this.setParams("me", !this.state.queryParams.me)
                      }
                    ></input>
                    <span style={{flex: 2}}>Mine</span>
                  </label>
                )}
                {isStaff && (
                  <>
                    <label
                      id="only-participants-lbl"
                      className="d-flex align-items-center m-0"
                    >
                      <input
                        type="checkbox"
                        id="only-participant"
                        className="ml-1 mr-1"
                        checked={this.state.queryParams.participants || false}
                        onChange={() =>
                          this.setParams(
                            "participants",
                            !this.state.queryParams.participants
                          )
                        }
                      ></input>
                      <span className="text-danger" style={{flex: 2}}>
                        Participants
                      </span>
                    </label>
                    <label
                      id="only-participants-lbl"
                      className="d-flex align-items-center m-0"
                    >
                      <input
                        type="checkbox"
                        id="only-participant"
                        className="ml-1 mr-1"
                        checked={this.state.queryParams.spectators || false}
                        onChange={() =>
                          this.setParams(
                            "spectators",
                            !this.state.queryParams.spectators
                          )
                        }
                      ></input>
                      <span className="text-danger" style={{flex: 2}}>
                        Spectators
                      </span>
                    </label>
                  </>
                )}
              </div>
            </div>

            <div
              className="p-1 text-right"
              style={{
                display: "flex",
                flexDirection: "row-reverse",
                columnGap: "5px",
              }}
            >
              <Button
                size="sm"
                variant="light"
                className="btn-svg"
                onClick={() => this.onClear()}
              >
                <FaTimes /> Clear
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="btn-svg"
                onClick={() => this.onFilter()}
              >
                <FaFilter /> Filter
              </Button>
            </div>
          </>
        )}
      </div>
    );
  }
}

let wrapped = ContestSubFilterSidebar;
const mapStateToProps = state => {
  return {
    user: state.user.user,
    profile: state.profile.profile,
    subFilter: state.subFilter,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setContestParams: (key, params) =>
      dispatch(setContestParams({key, params})),
    setPublicParams: params => dispatch(setPublicParams({params})),
    clearContestParams: key => dispatch(clearContestParams({key})),
    clearPublicParams: () => dispatch(clearPublicParams()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(wrapped);
