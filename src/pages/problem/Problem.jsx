import React from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import { FaPaperPlane } from 'react-icons/fa';

import problemApi from 'api/problem';

import { log } from 'helpers/logger';

import './Problem.scss'

class ProblemListItem extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {rowid, shortname, title, solved_count, attempted_count, points} = this.props;
    return (
      <tr>
        <td>
          <Link to={`/problem/${shortname}`}>{shortname}</Link>
        </td>
        <td>
          <Link to={`/problem/${shortname}`}>{title}</Link>
        </td>
        <td>{points}</td>
        <td>{solved_count}</td>
        <td>{attempted_count === 0 ? '?' : `${(solved_count*100.0/attempted_count).toFixed(2)}%`}</td>
        <td>
          <Link to={`/problem/${shortname}/submit`}><FaPaperPlane/></Link>
        </td>
      </tr>
    )
  }
}

class ProblemList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      problems: [],
      currPage: 1,
      pageCount: 1,
    }
  }

  componentDidMount() {
    problemApi.getProblems()
      .then((res) => {
        log(res);
        this.setState({
          problems: res.data.results,
          count: res.data.count,
          previous: res.data.previous,
          next: res.data.next,
        })
      })
      .catch((err) => {

      })
  }

  render() {
    return (
      <div className="problem-table">
        <h4>Problem Set</h4>
        <Table responsive hover size="sm" striped bordered className="rounded">
          <thead>
            <tr>
              <th>#</th>
              <th style={{width: "30%"}}>Title</th>
              <th>Points</th>
              <th>Solved</th>
              <th>Success Rate</th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.problems.map((prob, idx) => <ProblemListItem
                rowid={idx} {...prob}
              />)
            }
          </tbody>
        </Table>

        <div className="problem-table-footer">
          <hr/>
          <span>Page:
            <a>[1]</a>
          </span>
        </div>
      </div>
    )
  }
}

export {
  ProblemList,
}