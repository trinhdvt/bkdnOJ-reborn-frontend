import React from 'react';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import { Link, Navigate } from 'react-router-dom';
import { Button, Table } from 'react-bootstrap';

import {AiOutlinePlusCircle, AiOutlineArrowRight,
  AiOutlineForm, } from 'react-icons/ai';

import { SpinLoader, ErrorBox } from 'components';
import contestAPI from 'api/contest';
import { setTitle } from 'helpers/setTitle';
import { getYearMonthDate, getHourMinuteSecond } from 'helpers/dateFormatter';

import './List.scss'
import 'styles/ClassicPagination.scss';

const CLASSNAME = 'Contest';

class ContestListItem extends React.Component {
  formatDateTime(date) {
    const d = new Date(date);
    return (
      <div className="flex-center-col">
        <div style={{fontSize: "10px"}}>
          {getYearMonthDate(d)}
        </div>
        <div style={{fontSize: "12px"}}>
          {getHourMinuteSecond(d)}
        </div>
      </div>
    )
  }

  render() {
    const { id, ckey, name, start_time, end_time, is_visible,
      is_private, is_organization_private, is_rated, format_name } = this.props;
    const {rowidx, selectChk, onSelectChkChange} = this.props;

    return (
      <tr>
        <td className="text-truncate" >
          <Link to={`/admin/contest/${ckey}`}>
            {id}
          </Link>
        </td>
        <td className="text-truncate" >
          <Link to={`/admin/contest/${ckey}`}>
            {ckey}
          </Link>
        </td>
        <td className="text-truncate" style={{maxWidth: "150px"}}>
          <Link to={`/admin/contest/${ckey}`}>
            {name}
          </Link>
        </td>
        <td className="text-truncate" >
          {this.formatDateTime(start_time)}
        </td>
        <td className="text-truncate" >
          {this.formatDateTime(end_time)}
        </td>
        <td>
          {
            is_visible ? (
              (is_organization_private || is_private) ? "Orgs/Users" : "Public"
            ) : "Private"
          }
        </td>
        <td>{is_rated ? "Yes" : "No"}</td>
        <td>{format_name}</td>
        {/* <td className="text-truncate" style={{maxWidth: "200px"}}>
          {(new Date(date)).toLocaleString()}
        </td> */}
        <td>
            <input type="checkbox" value={selectChk}
              onChange={() => onSelectChkChange()}/>
        </td>
      </tr>
    )
  }
}

class AdminContestList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contests: [],
      selectChk: [],
      currPage: 0,
      pageCount: 1,
      loaded: false,
      errors: null,

      redirectUrl: null,
    }
    setTitle('Admin | Contests')
  }

  selectChkChangeHandler(idx) {
    const {selectChk} = this.state;
    if (idx >= selectChk.length)
      console.log('Invalid delete tick position');
    else {
      const val = selectChk[idx];
      this.setState({
        selectChk: selectChk.slice(0, idx).concat(!val, selectChk.slice(idx+1))
      })
    }
  }

  callApi(params) {
    this.setState({loaded: false, errors: null})

    contestAPI.getAllContests({page: params.page+1})
      .then((res) => {
        this.setState({
          contests: res.data.results,
          count: res.data.count,
          pageCount: res.data.total_pages,
          currPage: params.page,

          selectChk: Array(res.data.results.length).fill(false),
          loaded: true,
        })
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          loaded: true,
          errors: ["Cannot fetch contests. Please retry again."],
        })
      })
  }

  componentDidMount() {
    this.callApi({page: this.state.currPage});
  }

  handlePageClick = (event) => {
    this.callApi({page: event.selected});
  }

  handleDeleteSelect(e) {
    e.preventDefault();

    let ids = [];
    this.state.selectChk.forEach((v, i) => {
      if (v) ids.push(this.state.contests[i].key)
    })

    if (ids.length === 0) {
      alert(`Không có ${CLASSNAME} nào đang được chọn.`);
      return;
    }

    // TODO: Write a bulk delete API for submissions
    const conf = window.confirm(`Xóa các ${CLASSNAME} ` + JSON.stringify(ids) + '?');
    if (conf) {
      let reqs = []
      ids.forEach((k) => {
        reqs.push( contestAPI.deleteContest({key: k}) )
      })

      Promise.all(reqs).then((res) => {
        console.log(res)
        this.callApi({page: this.state.currPage});
      }).catch((err) => {
        let msg = `Không thể xóa các ${CLASSNAME} này.`;
        if (err.response) {
          if (err.response.status === 405)
            msg += ' Phương thức chưa được implemented.';
          if (err.response.status === 404)
            msg = `Không tìm thấy một trong số ${CLASSNAME} được chọn. Có lẽ chúng đã bị xóa?`
          if ([403, 401].includes(err.response.status))
            msg = 'Không có quyền cho thao tác này.';
        }
        this.setState({ errors: [msg] })
      })
    }
  }

  render() {
    if (this.state.redirectUrl)
      return ( <Navigate to={`${this.state.redirectUrl}`} /> )

    const { submitting } = this.state;

    return (
      <div className="admin admin-contests wrapper-vanilla">
      {/* Options for Admins: Create New,.... */}
      <div className="admin-options">
        <div className="border d-inline-flex p-1" >
          <Button size="sm"
            variant="dark" className="btn-svg" disabled={submitting}
            onClick={(e) => this.setState({ redirectUrl: 'new' })}
          >
            <AiOutlinePlusCircle />
            <span className="d-none d-md-inline-flex">Add (Form)</span>
            <span className="d-inline-flex d-md-none">
              <AiOutlineArrowRight/>
              <AiOutlineForm />
            </span>
          </Button>
        </div>
      </div>

      {/* Place for displaying information about admin actions  */}
      <div className="admin-note text-center mb-1">
        {
          submitting && <span className="loading_3dot">Đang xử lý yêu cầu</span>
        }
      </div>

      {/* Problem List */}
      <div className="admin-table contest-table">
        <h4>Contest List</h4>
        <ErrorBox errors={this.state.errors} />
        <Table responsive hover size="sm" striped bordered className="rounded">
          <thead>
            <tr>
              <th >#</th>
              <th style={{maxWidth: "10%"}}>Key</th>
              <th style={{minWidth: "20%", maxWidth: "20%"}}>Name</th>
              <th style={{minWidth: "15%"}}>Start</th>
              <th style={{minWidth: "15%"}}>End</th>
              <th >Visible?</th>
              <th >Rated?</th>
              <th >Format</th>
              <th >
                <Link to="#" onClick={(e) => this.handleDeleteSelect(e)}>Delete</Link>
              </th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.loaded === false
                ? <tr><td colSpan="9"><SpinLoader margin="10px" /></td></tr>
                : this.state.contests.map((sub, idx) => <ContestListItem
                    key={`cont-${sub.id}`}
                    rowidx={idx} ckey={sub.key} {...sub}
                    selectChk={this.state.selectChk[idx]}
                    onSelectChkChange={() => this.selectChkChangeHandler(idx)}
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
      </div>
    )
  }
}

export default AdminContestList;
