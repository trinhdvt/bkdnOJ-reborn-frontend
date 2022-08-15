import React from "react";
import {connect} from "react-redux";
import ReactPaginate from "react-paginate";
import {Link} from "react-router-dom";
import {Table} from "react-bootstrap";

// import { FaPaperPlane } from 'react-icons/fa';
import {GiTrophyCup} from "react-icons/gi";

import {SpinLoader, ErrorBox} from "components";
import submissionApi from "api/submission";
import contestApi from "api/contest";
import dateFormatter, {
  getYearMonthDate,
  getHourMinuteSecond,
} from "helpers/dateFormatter";

// Assets
import {FaRegEyeSlash} from "react-icons/fa";

// Helpers
import {setTitle} from "helpers/setTitle";
import {parseTime, parseMem} from "helpers/textFormatter";

// Contexts
import ContestContext from "context/ContestContext";

import "./SubmissionList.scss";
import "styles/ClassicPagination.scss";
import {NO_CONTEST_KEY} from "redux/SubFilter/types";

const verdictExplains = {
  AC: "Your solution gives correct output within given contraints.",
  WA: "Your solution gives wrong output.",
  TLE: "Your solution used too much time.",
  MLE: "Your solution used too much memory.",
  OLE: "Your solution printed too much data.",
  IR: "Your solution did not return exitcode 0.",
  RTE: "Your solution did no return exitcode 0.",
  IE: "There is something wrong with the servers. The admins are notified.",
  CE: "There is syntax error in your solution. Please Double-check the language and version.",
  FR: "Results are frozen and will be revealed later.",
};
function getVerdict(ver) {
  return verdictExplains[ver] || ver;
}

class SubListItem extends React.Component {
  parseDate(date) {
    // return dateFormatter(date);
    return (
      <div className="flex-center-col">
        <span style={{fontSize: "10px"}}>{getYearMonthDate(date)}</span>
        <span style={{fontSize: "14px"}}>{getHourMinuteSecond(date)}</span>
      </div>
    );
  }
  render() {
    const {
      id,
      problem,
      user,
      status,
      result,
      time,
      memory,
      date,
      points,
      language,
      contest_object,
      is_frozen,
      virtual,
      yourUsername,
    } = this.props;
    const linkPrefix = this.props.contest
      ? `/contest/${this.props.contest.key}`
      : "";

    const verdict = status === "D" ? result : status;

    const max_time = problem.time_limit;
    const max_points = problem.points;

    const isSpectatorSubmission = virtual && !(virtual === "live");

    return (
      <tr className={isSpectatorSubmission ? "spectator-submission" : ""}>
        <td className="text-truncate flex-center-col">
          <Link to={`${linkPrefix}/submission/${id}`}>#{id}</Link>
          {isSpectatorSubmission && (
            <div
              data-toggle="tooltip"
              data-placement="right"
              title={`This submission is not visible to participants.`}
            >
              <FaRegEyeSlash />
            </div>
          )}
        </td>

        <td style={{minWidth: "100px"}}>{this.parseDate(date)}</td>

        <td className="general-info">
          <div className="general-info-container">
            <span className="problem text-truncate">
              <Link to={`${linkPrefix}/problem/${problem.shortname}`}>
                {problem.title}
              </Link>
              {contest_object && (
                <span
                  className="ml-1"
                  data-toggle="tooltip"
                  data-placement="right"
                  title={`This submission was made in contest ${contest_object}`}
                >
                  <Link to={`/contest/${contest_object}`}>
                    (<GiTrophyCup />
                    {contest_object})
                  </Link>
                </span>
              )}
            </span>
            <span className="author text-truncate">
              <em>
                {`by `}
                <Link to={`/user/${user}`}>
                  {yourUsername === user ? (
                    <strong>{user}</strong>
                  ) : (
                    <span>{user}</span>
                  )}
                </Link>
              </em>
              <span className="language text-truncate">({language})</span>
            </span>
          </div>
        </td>

        <td
          className={`verdict ${verdict.toLowerCase()}`}
          data-toggle="tooltip"
          data-placement="right"
          title={`${getVerdict(verdict)}`}
        >
          <div className="verdict-container">
            <div className={`verdict-wrapper ${verdict.toLowerCase()}`}>
              <span className={`text`}>{verdict}</span>
            </div>

            {typeof points === "number" ? (
              <div
                className="points-container available"
                data-toggle="tooltip"
                data-placement="right"
                title={`${points}/${max_points}`}
              >
                <span className="sub-points text-truncate">{points}</span>
                <span className="prob-points text-truncate">{max_points}</span>
              </div>
            ) : (
              <div className="points-container available">
                <span className="sub-points text-truncate">
                  {is_frozen ? "?" : "n/a"}
                </span>
                <span className="prob-points text-truncate">{max_points}</span>
              </div>
            )}
          </div>
        </td>

        <td className="resource-allocated">
          <div className="resource-allocated-container flex-center-col">
            <span className="cpu-usage">
              {is_frozen
                ? "?"
                : verdict.toLowerCase() === "tle"
                ? `--`
                : parseTime(time)}
            </span>
            <span className="mem-usage">
              {is_frozen
                ? "?"
                : verdict.toLowerCase() === "mle"
                ? `--`
                : parseMem(memory)}
            </span>
          </div>
        </td>
      </tr>
    );
  }
}

class SubmissionList extends React.Component {
  static contextType = ContestContext;

  constructor(props) {
    super(props);
    this.state = {
      contest: null,

      submissions: [],
      currPage: 0,
      pageCount: 1,
      loaded: false,
      errors: null,
    };
    setTitle(`Submissions`);
  }

  callApi(params = {page: 0}) {
    this.setState({loaded: false, errors: null});

    if (this.state.contest) {
      const extraParams = this.props.subFilter[this.state.contest.key] || {};

      contestApi
        .getContestSubmissions({
          key: this.state.contest.key,
          params: {page: params.page + 1, ...extraParams},
        })
        .then(res => {
          this.setState({
            submissions: res.data.results,
            count: res.data.count,
            pageCount: res.data.total_pages,
            currPage: params.page,
            loaded: true,
          });
        })
        .catch(err => {
          this.setState({
            loaded: true,
            errors:
              err.response.data || "Cannot fetch submissions at the moment.",
          });
        });
    } else {
      const extraParams = this.props.subFilter[NO_CONTEST_KEY] || {};
      let prms = {page: params.page + 1, ...extraParams};

      if (this.props.selectedOrg.slug) {
        prms.org = this.props.selectedOrg.slug;
      }

      submissionApi
        .getSubmissions(prms)
        .then(res => {
          this.setState({
            submissions: res.data.results,
            count: res.data.count,
            pageCount: res.data.total_pages,
            currPage: params.page,
            loaded: true,
          });
        })
        .catch(err => {
          this.setState({
            loaded: true,
            errors: err.response.data || "Cannot fetch problems at the moment.",
          });
        });
    }
  }

  componentDidMount() {
    const contest = this.context.contest;
    if (contest) {
      setTitle(`${contest.name} | Submissions`);
      this.setState({contest}, () => this.callApi({page: this.state.currPage}));
    } else this.callApi({page: this.state.currPage});
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.selectedOrg !== this.props.selectedOrg) {
      this.callApi();
    }
    if (prevProps.subFilter !== this.props.subFilter) {
      this.callApi();
    }
  }

  handlePageClick = event => {
    this.callApi({page: event.selected});
  };

  render() {
    const {loaded, errors, count} = this.state;
    const {user} = this.props;
    const username = (user && user.username) || "";

    return (
      <div className="submission-table wrapper-vanilla">
        <h4>Submissions</h4>
        <ErrorBox errors={errors} />
        <Table responsive hover size="sm" striped bordered className="rounded">
          <thead>
            <tr>
              <th>Sub</th>
              <th>When</th>
              <th>Info</th>
              <th>Result</th>
              <th>Usage</th>
            </tr>
          </thead>
          <tbody>
            {!loaded ? (
              <tr>
                <td colSpan="7">
                  <SpinLoader margin="10px" />
                </td>
              </tr>
            ) : (
              !errors && (
                <>
                  {" "}
                  {this.state.count > 0 ? (
                    this.state.submissions.map((sub, idx) => (
                      <SubListItem
                        key={`sub-${sub.id}`}
                        contest={this.context.contest}
                        rowid={idx}
                        {...sub}
                        yourUsername={username}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7}>
                        <em>No submission is available yet.</em>
                      </td>
                    </tr>
                  )}
                </>
              )
            )}
          </tbody>
        </Table>
        {this.state.loaded === false ? (
          <SpinLoader margin="0" />
        ) : (
          <span className="classic-pagination">
            Page:{" "}
            <ReactPaginate
              breakLabel="..."
              onPageChange={this.handlePageClick}
              forcePage={this.state.currPage}
              pageLabelBuilder={page => `[${page}]`}
              pageRangeDisplayed={5}
              pageCount={this.state.pageCount}
              renderOnZeroPageCount={null}
              previousLabel={null}
              nextLabel={null}
            />
          </span>
        )}
      </div>
    );
  }
}

let wrapped = SubmissionList;
// wrapped = withParams(wrapped);
const mapStateToProps = state => {
  return {
    user: state.user.user,
    selectedOrg: state.myOrg.selectedOrg,
    subFilter: state.subFilter,
  };
};
wrapped = connect(mapStateToProps, null)(wrapped);
export default wrapped;
