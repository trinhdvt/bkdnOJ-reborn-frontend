import React from 'react';
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import { Table } from 'react-bootstrap';
// import { FaPaperPlane } from 'react-icons/fa';

import { SpinLoader, ErrorBox } from 'components';
import orgAPI from 'api/organization';
import dateFormatter, {getYearMonthDate, getHourMinuteSecond} from 'helpers/dateFormatter';

import { setTitle } from 'helpers/setTitle';
import { parseTime, parseMem } from 'helpers/textFormatter';

// Contexts
import ContestContext from 'context/ContestContext';
import { toast } from 'react-toastify';

// Styles
import 'styles/ClassicPagination.scss';
import './List.scss';
import { FaUniversity } from 'react-icons/fa';

class OrgItem extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { slug, name, logo_url, suborg_count, member_count } = this.props.org;

    return (
      <tr key={`org-${slug}`}>
        <td className="org-i">
          <div className="org-img-wrapper">
            {
              logo_url ? <img id="org-img" src={logo_url}/>
              : <FaUniversity size={40}/>
            }
          </div>
          <span className="org-slug">{slug}</span>
        </td>
        <td className="org-name">{name}</td>
        <td className="suborg_count">{suborg_count}</td>
        <td className="member_count">{member_count}</td>
      </tr>
    )
  }
}

class OrgList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      errors: null,

      orgs: [],
      count: 0,
      currPage: 0,
      pageCount: 1,
    }
  }

  refetch(params={page: 0}) {
    orgAPI.getOrgs({
      params: {page: params.page+1}
    })
    .then((res) => {
      this.setState({
        loaded: true,
        orgs: res.data.results,
        count: res.data.count,
        pageCount: res.data.total_pages,
        currPage: params.page,
      })
    })
    .catch((err) => {
      this.setState({loaded: true, errors: {errors: err.response.data} || "Cannot fetch Organizations at the moment."})
    })
  }

  componentDidMount() {
    setTitle("Organizations");
    this.refetch();
  }
  handlePageClick = (event) => {
    this.refetch({page: event.selected});
  }

  render() {
    const { loaded, errors, orgs, count } = this.state;

    return (
      <div className="org-table wrapper-vanilla">
        <h4>Organizations</h4>
        <ErrorBox errors={errors} />
        <Table responsive hover size="sm" striped bordered className="rounded">
          <thead>
            <tr>
              <th>#</th>
              <th>Tên tổ chức</th>
              <th>Số tổ chức con</th>
              <th>Số thành viên</th>
            </tr>
          </thead>
          <tbody>
            {
              !loaded
                ? <tr><td colSpan="99"><SpinLoader margin="10px" /></td></tr>
                : (
                  !errors && <> {
                    count > 0
                      ? orgs.map((org, ridx) => <OrgItem org={org} ridx={ridx} key={`org${org.slug}`}/>)
                      : <tr><td colSpan={99}><em>No orgs are available yet.</em></td></tr>
                    }</>
                )
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
                pageRangeDisplayed={5}
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

export default OrgList;
