import React from 'react';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Table } from 'react-bootstrap';

import { SpinLoader, ErrorBox } from 'components';
import submissionApi from 'api/submission';
import contestAPI from 'api/contest';

// Helpers
import { setTitle } from 'helpers/setTitle';

// Assets
import top1 from 'assets/common/atcoder_top1.png';
import top10 from 'assets/common/atcoder_top10.png';
import top30 from 'assets/common/atcoder_top30.png';
import top100 from 'assets/common/atcoder_top100.png';

// Contexts
import ContestContext from 'context/ContestContext';

// Styles
import './ContestStanding.scss';

class StandingItem extends React.Component {
  render() {
    const {rowIdx, user, score, cumtime, is_disqualified, virtual, format_data} = this.props;
    const { mapping } = this.props;

    let best = Array( Object.keys(mapping).length ).fill(<></>);
    let data = JSON.parse(format_data);
    if (data && data.constructor === Object)
      Object.keys(data).forEach((k) => {
        const v = data[k]; // => {'time': ..., 'points': ...}

        // this might not exists because admin of contest decide to delete them, but the contest data is still there
        if (!mapping[k]) return;
        const i = mapping[k].pos;

        const pts = mapping[k].points;
        let ptsClsName = '';
        if (pts > 0) {
          const percent = Math.round(v.points / pts * 100);
          if (percent <= 25) ptsClsName="one-fourth";
          else if (percent <= 50) ptsClsName="two-fourth";
          else if (percent <= 75) ptsClsName="three-fourth";
          else if (percent < 100) ptsClsName="fourth-fourth";
          else ptsClsName="full-points";
        }

        best[i] = (
          <div className="flex-center-col">
            <div className={`p-best-points points ${ptsClsName}`}>{
              `${v.points}`
            }</div>
            <div className="p-best-time text-truncate time">{
              Math.floor(parseFloat(v.time))
            }</div>
          </div>
        )
      })

    const realname = `${user.first_name} ${user.last_name}`;

    return (
      <tr>
        <td className="td-rank">
          <div className="flex-center rank-display">
            <div className="rank-position">
              {rowIdx+1}
            </div>
            {
              (rowIdx === 0) ? <img src={top1} alt="Atcoder Top 1 Icon"/> : ''
            }
            {
              (0 < rowIdx && rowIdx < 10) ? <img src={top10} alt="Atcoder Top 10 Icon"/> : ''
            }
            {
              (10 <= rowIdx && rowIdx < 30) ? <img src={top30} alt="Atcoder Top 30 Icon"/> : ''
            }
            {
              (30 <= rowIdx && rowIdx < 100) ? <img src={top100} alt="Atcoder Top 100 Icon"/> : ''
            }
          </div>
        </td>
        <td className="td-participant">
          <div className="flex-center participant-container">
            <div className="avatar-container">
              <img className='img-fluid' src="https://www.gravatar.com/avatar/HASH"></img>
              {/* <img className='img-fluid' src={user.avatar} alt="User Avatar"></img> */}
            </div>
            <div className="flex-center-col">
              <div className="text-left acc-username">{user.username}</div>
              {realname.length > 0 && realname !== ' ' && <div className="text-left acc-realname">{realname}</div>}
            </div>
          </div>
        </td>

        <td className="td-total">
          <div className="flex-center-col">
            <div className="p-best-points points">{
              score
            }</div>
            <div className="p-best-time text-truncate time">{
              cumtime
            }</div>
          </div>
        </td>

        {
          best.map((c, i) => <td className="td-p-best"
            key={`ct-st-pb-${user.username}-${i}`} >{c}</td>)
        }
      </tr>
    )
  }
}

class ContestStanding extends React.Component {
  static contextType = ContestContext;

  constructor(props) {
    super(props);
    this.state = {
      id2idx: {},
      problems: null,
      standing: [],

      loaded: false,
      errors: null,

      contest: null,
      user: null,
    }
  }

  refetch() {
    this.setState({ loaded: false, errors: null })
    contestAPI.getContestStanding({key : this.state.contest.key})
    .then((res) => {
      this.setState({
        loaded: true,
        standing: res.data.results,
        problems: res.data.problems,
      })

      let mapping = {}; // mapping here is a list of problems in the contest -> their id
      let uniq=0;
      res.data.problems.forEach( (prob) => {
        if (mapping[prob.id]) return;
        mapping[prob.id] = {
          pos: uniq,
          points: prob.points,
        }
        uniq++;
      })
      this.setState({ id2idx : mapping })
    })
    .catch((err) => {
      this.setState({
        loaded: true,
        errors: err,
      })
      toast.error(`Standing not available. (${err.response.status})`, {
        toastId: "contest-standing-na",
      })
    })
  }

  componentDidMount() {
    this.setState({
      contest: (this.context && this.context.contest) || null,
      user: (this.props && this.props.user) || null,
    })
  }
  componentDidUpdate(prevProps, prevState) {
    const { user } = this.props;
    const { contest } = this.context;
    if (!contest) return; // skip if no contest
    if (prevState.contest !== contest || prevState.user !== user) {
      this.setState({ user, contest }, () => {
        setTitle(`${contest.name} | Standing`)
        this.refetch()
      });
    }
  }

  render() {
    const { loaded, errors, problems, standing } = this.state;

    return (
      <div className="wrapper-vanilla p-2" id="contest-standing">
        <h4>Standing</h4>
        { !loaded && <SpinLoader margin="40px"/> }
        { loaded && <>
          <ErrorBox errors={this.state.errors} />
          <Table responsive hover size="sm" striped bordered className="rounded">
            <thead>
              <tr>
              <th className="th-rank">Rank</th>
              <th className="th-participant">Participant</th>
              <th className="th-score">Score</th>
              {
                problems.map((prob, idx) => <th key={`cs-th-prb-${idx}`}
                  className={`th-p-best`}>{ prob.label }</th>)
              }
              </tr>
            </thead>
            <tbody>
              {
                standing.map((part, idx) => <StandingItem
                  key={`ct-st-row-${idx}`}
                  mapping={this.state.id2idx} rowIdx={idx} {...part} />)
              }
            </tbody>
          </Table>
        </>}
      </div>
    )
  }
}

let wrapped = ContestStanding;
const mapStateToProps = state => {
  return {
    user: state.user.user,
    // profile: state.profile.profile,
  }
}
export default connect(mapStateToProps, null)(wrapped);
