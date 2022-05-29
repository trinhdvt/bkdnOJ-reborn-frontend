import React from 'react';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import { Table } from 'react-bootstrap';
// import { FaPaperPlane } from 'react-icons/fa';

import { SpinLoader, ErrorBox } from 'components';
import submissionApi from 'api/submission';
import dateFormatter from 'helpers/dateFormatter';
import { setTitle } from 'helpers/setTitle';

import './SubmissionList.scss'
import 'styles/ClassicPagination.scss';

const verdictExplains = {
  'AC': "Your solution gives correct output within given contraints.",
  'WA': "Your solution gives wrong output.",
  'TLE': "Your solution used too much time.",
  'MLE': "Your solution used too much memory.",
  'OLE': "Your solution printed too much data.",
  'IR': "Your solution did not return exitcode 0.",
  'RTE': "Your solution did no return exitcode 0.",
  'IE': "There is something wrong with the servers. The admins are notified.",
  'CE': "There is syntax error in your solution. Please Double-check the language and version.",
}
function getVerdict(ver) {
  return (verdictExplains[ver] || ver);
}

class SubListItem extends React.Component {
  parseTime(time) {
    if (time === 0) return "0 ms";
    if (!time) return "N/A";
    return `${(time*1000).toFixed(0)} ms`
  }
  parseMemory(mem) {
    if (mem === 0) return "0 KB";
    if (!mem) return "N/A";
    if (mem > 65535)
      return `${(mem+1023)/1024} MB`
    return `${mem} KB`
  }
  parseDate(date) {
    return dateFormatter(date);
  }
  render() {
    const {id, problem, user, status, result, time, memory, date} = this.props;
    const verdict = (status === "D" ? result : status);

    return (
      <tr>
        <td className="text-truncate">
          <Link to={`/submission/${id}`}>{id}</Link>
        </td>
        <td className="text-truncate" style={{maxWidth: "200px"}}>
          <Link to={`/problem/${problem.shortname}`}>{problem.title}</Link>
        </td>
        <td className="text-truncate" >
          <Link to={`/user/${user}`}>{user}</Link>
        </td>

        {
          <td className={`verdict ${verdict.toLowerCase()}`}
            data-toggle="tooltip" data-placement="right" title={`${getVerdict(verdict)}`}
          >
              <span>{verdict}</span>
          </td>
        }

        <td>{this.parseTime(time)}</td>
        <td>{this.parseMemory(memory)}</td>
        <td style={{minWidth: "100px"}}>{this.parseDate(date)}</td>
      </tr>
    )
  }
}

class SubmissionList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submissions: [],
      currPage: 0,
      pageCount: 1,
      loaded: false,
      errors: null,
    }
    setTitle(`Submissions`)
  }

  callApi(params) {
    this.setState({loaded: false, errors: null})

    submissionApi.getSubmissions({page: params.page+1})
      .then((res) => {
        this.setState({
          submissions: res.data.results,
          count: res.data.count,
          pageCount: res.data.total_pages,
          currPage: params.page,
          loaded: true,
        })
      })
      .catch((err) => {
        this.setState({
          loaded: true,
          errors: ["Cannot fetch submissions at the moment. Please retry again."],
        })
      })
  }

  componentDidMount() {
    this.callApi({page: this.state.currPage});
  }

  handlePageClick = (event) => {
    this.callApi({page: event.selected});
  }

  render() {
    return (
      <div className="submission-table">
        <h4>Public Submission</h4>
        <ErrorBox errors={this.state.errors} />
        <Table responsive hover size="sm" striped bordered className="rounded">
          <thead>
            <tr>
              <th>#</th>
              <th>Problem</th>
              <th>Author</th>
              <th>Status</th>
              <th>Time</th>
              <th>Memory</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.loaded === false
                ? <tr><td colSpan="7"><SpinLoader margin="10px" /></td></tr>
                : this.state.submissions.map((sub, idx) => <SubListItem
                    key={`sub-${sub.id}`}
                    rowid={idx} {...sub}
                  />)
            }
          </tbody>
        </Table>
        {
          this.state.loaded === false
            ? <SpinLoader margin="0" />
            : <span className="classic-pagination">Page: <ReactPaginate
                breakLabel="..."
                onPageChange={this.handlePageClick}
                forcePage={this.state.currPage}
                pageLabelBuilder={(page) => `[${page}]`}
                pageRangeDisplayed={3}
                pageCount={this.state.pageCount}
                renderOnZeroPageCount={null}
                previousLabel={null}
                nextLabel={null}
                /></span>
        }
      </div>
    )
  }
}

export {
  SubmissionList,
}
