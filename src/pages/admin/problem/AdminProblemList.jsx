import React from 'react';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import { Button, Table } from 'react-bootstrap';

import { FaPaperPlane, FaRegFileArchive } from 'react-icons/fa';
import { AiOutlineForm, AiOutlineUpload, AiOutlineArrowRight, AiOutlinePlusCircle } from 'react-icons/ai';

import { SpinLoader, ErrorBox, FileUploader } from 'components';
import problemApi from 'api/problem';
import { setTitle } from 'helpers/setTitle';

import './AdminProblemList.scss'
import 'styles/ClassicPagination.scss';

class ProblemListItem extends React.Component {
  render() {
    const {shortname, title, points, is_published, is_privated_to_orgs} = this.props;
    const {rowidx, selectChk, onSelectChkChange} = this.props;

    return (
      <tr>
        <td className="text-truncate" style={{maxWidth: "80px"}}>
          <Link to={`/admin/problem/${shortname}`}>
            {shortname}
          </Link>
        </td>
        <td className="text-truncate" style={{maxWidth: "200px"}}>
          <Link to={`/admin/problem/${shortname}`}>
            {title}
          </Link>
        </td>
        <td>{points}</td>
        <td>{is_published ? "Yes" : "No"}</td>
        <td>{is_privated_to_orgs ? "Yes" : "No"}</td>
        <td>
            <input type="checkbox" value={selectChk[rowidx]}
              onChange={(e) => onSelectChkChange(rowidx)}
            />
        </td>
      </tr>
    )
  }
}

class AdminProblemList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      problems: [],
      selectChk: [],
      currPage: 0,
      pageCount: 1,
      loaded: false,
      errors: null,

      selectedZip: null,
      submitting: false,
    }
    setTitle('Admin | Problems')
  }

  setSelectedZip(zip) { this.setState({ selectedZip : zip }) }

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

    problemApi.getProblems({page: params.page+1})
      .then((res) => {
        this.setState({
          problems: res.data.results,
          count: res.data.count,
          pageCount: res.data.total_pages,
          currPage: params.page,
          loaded: true,
          selectChk: Array(res.data.results.length).fill(false),
        })
      })
      .catch((err) => {
        this.setState({
          loaded: true,
          errors: ["Cannot fetch problems. Please retry again."],
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

    let names = [];
    this.state.selectChk.forEach((v, i) => {
      if (v) names.push(this.state.problems[i].shortname)
    })

    if (names.length === 0) {
      alert('Không có bài tập nào đang được chọn.');
      return;
    }

    // TODO: Write a bulk delete API for problems
    const conf = window.confirm('Xóa các bài tập ' + JSON.stringify(names) + '?');
    if (conf) {
      let reqs = []
      names.forEach((shortname) => {
        reqs.push( problemApi.adminDeleteProblem({shortname}) )
      })

      Promise.all(reqs).then((res) => {
        this.callApi({page: this.state.currPage});
      }).catch((err) => {
        let msg = 'Không thể xóa các problem này.';
        if (err.response) {
          if (err.response.status === 405)
            msg += ' Phương thức chưa được implemented.';
          if (err.response.status === 404)
            msg = 'Không tìm thấy một trong số Problem được chọn. Có lẽ chúng đã bị xóa?'
          if ([403, 401].includes(err.response.status))
            msg += ' Có một vài Problem được chọn mà bạn không có quyền.';
        }
        this.setState({ errors: [msg] })
      })
    }
  }

  render() {
    const {selectedZip, submitting} = this.state;

    return (
      <div className="admin admin-problems wrapper-vanilla">
      {/* Options for Admins: Create New,.... */}
      <div className="admin-options">
        <div className="border d-inline-flex p-1" >
        <Button size="sm" onClick={(e)=>alert('Create new')}
          variant="dark" className="btn-svg" disabled={true || submitting}
          onClick={(e) => {
            this.setState({submitting: true}, () => 
              setTimeout(() => this.setState({submitting: false}), 2000)
            )
          }}
        >
          <AiOutlinePlusCircle />
          <span className="d-none d-md-inline-flex">Add (Form)</span>
          <span className="d-inline-flex d-md-none">
            <AiOutlineArrowRight/>
            <AiOutlineForm />
          </span>
        </Button>
        </div>

        <div className="border d-inline-flex p-1" >
          <FileUploader
            onFileSelectSuccess={(file) => this.setSelectedZip(file)}
            onFileSelectError={({ error }) => alert(error)}
          />
          <Button disabled={submitting}
            onClick={(e)=>{
              if (!selectedZip) alert("Please select a .zip file.");
              else { 
                this.setState({submitting: true}, () => {
                  const formData = new FormData();
                  formData.append("archive", selectedZip);
                  problemApi.adminPostProblemFromZip({formData})
                    .then((res) => {
                      toast.success("Đã tạo Problem mới thành công.")
                      this.callApi({page: this.state.currPage});
                    })
                    .catch((err) => {
                      const data = err.response.data;
                      let errors = {...data.errors}
                      if (data.detail) errors.general = data.detail
                      this.setState({ errors })
                    })
                    .finally(() => this.setState({submitting: false}))
                })
              }
            }}
            size="sm" variant="dark" className="btn-svg"
          >
            <AiOutlinePlusCircle /> 
            <span className="d-none d-md-inline-flex">Add (upload Zip)</span>
            <span className="d-inline-flex d-md-none">
              <AiOutlineArrowRight/>
              <FaRegFileArchive />
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
      <div className="admin-table problem-table">
        <h4>Problem List</h4>
        <ErrorBox errors={this.state.errors} />
        <Table responsive hover size="sm" striped bordered className="rounded">
          <thead>
            <tr>
              <th style={{width: "20%"}}>#</th>
              <th style={{minWidth: "30%", maxWidth: "30%"}}>Title</th>
              <th style={{width: "12%"}}>Points</th>
              <th style={{width: "10%"}}>Public?</th>
              <th style={{width: "10%"}}>Orgs Limited?</th>
              <th style={{width: "8%"}}>
                <Link to="#" onClick={(e) => this.handleDeleteSelect(e)}>Delete</Link>
              </th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.loaded === false
                ? <tr><td colSpan="7"><SpinLoader margin="10px" /></td></tr>
                : this.state.problems.map((prob, idx) => <ProblemListItem
                    key={`prob-${prob.shortname}`}
                    rowidx={idx} {...prob}
                    selectChk={this.state.selectChk}
                    onSelectChkChange={(i) => this.selectChkChangeHandler(i)}
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

export default AdminProblemList;
