import React from 'react';
import { Link } from 'react-router-dom';
import {
  Form, Row, Col, Table, Button
} from 'react-bootstrap';
import ReactPaginate from 'react-paginate';

import { SpinLoader, ErrorBox } from 'components';
import contestAPI from 'api/contest';
import 'styles/ClassicPagination.scss';

const INITIAL_STATE = {
  participations: [],
  count: null,
  currPage: 0,
  pageCount: 1,
  // bools
  loaded: false,
  errors: null,
  // params
  virtual: null,
};

class Participation extends React.Component {
  constructor(props) {
    super(props);
    this.ckey = this.props.ckey;
    this.state = INITIAL_STATE;
  }
  resetFetch() {
    this.setState( INITIAL_STATE, () => this.refetch() );
  }

  clarifyPopup(msg) { return <Link to="#" onClick={() => alert(msg)}>?</Link> }

  refetch(params={page: 0}) {
    this.setState({loaded: false, errors: null})
    let prms = {page : params.page+1}
    if (this.state.virtual) prms.virtual = this.state.virtual;

    contestAPI.getContestParticipations({ key:this.ckey, params: prms })
      .then((res) => {
        this.setState({
          participations: res.data.results,
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
          errors: ["Cannot fetch Participations for this contest."],
        })
      })
  }

  handlePageClick = (event) => {
    this.callApi({page: event.selected});
  }

  componentDidMount() {
    this.refetch();
  }

  render() {
    const { participations } = this.state;
    return (
      <>
      <div className="table-wrapper m-2">
        <div className="options mb-1">
          <Row className="border m-1 d-inline-flex text-right">

            <Button size="sm" variant="dark" onClick={(e)=>this.resetFetch()}>
              Reset
            </Button>

          </Row>

          <Row className="border m-1">
            <Col className="d-inline-flex" md={4}>
              <div className="mr-2">Participation type:</div>
            </Col>
            <Col className="d-inline-flex" md={8}>
              {['LIVE', 'SPECTATE'].map((type) => (
                <div key={`part-${type}`} className="">
                  <Form.Check inline name="participation-type" type="radio"
                    id={`${type}`} label={`${type}`} checked={type === this.state.virtual}
                    onChange={(e) => this.setState({ virtual: e.target.id })}
                  />
                </div>
              ))}
            </Col>
          </Row>
        </div>

        <hr className="m-2"/>

        <div className="admin-table contest-participation-table">
          <h4 className="m-0">Participations</h4>
          <Table responsive hover size="sm" striped bordered className="rounded mb-0">
            <thead>
              <tr>
                <th>#</th>
                <th>User</th>
                <th>When</th>
                <th>Type {
                  this.clarifyPopup('Hình thức tham dự của thí sinh. (-1 -> SPECTATE, chỉ theo dõi, kết quả không được tính), '+
                                    '(0 -> LIVE, thí sinh tham dự chính thức), (khác -> VIRTUAL, thí sinh tham dự không chính '+
                                    'thức, sau khi contest đã kết thúc).')
                }</th>
                <th>Disqualified {
                  this.clarifyPopup('Những lần tham dự bị Disqualified này sẽ mang điểm là -9999 trên bảng xếp hạng. '+
                                    'Nếu lượt tham dự này là LIVE, thí sinh này sẽ không được xếp hạng Rating.')
                }</th>
              </tr>
            </thead>
            <tbody> {
              participations.map((part) => <tr key={`ct-part-${part.id}`}>
                <td>{part.id}</td>
                <td>{part.user}</td>
                <td>{part.real_start}</td>
                <td>{part.virtual}</td>
                <td>{part.is_disqualified ? "Yes" : "No"}</td>
              </tr>)
            } </tbody>
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

        <Row className="mt-2">
          <Col ></Col>
          <Col xs={2}>
            <Button size="sm" variant="dark" style={{width: "100%"}}
              disabled={!this.state.loaded}
              onClick={(e) => this.refetch()}> Search </Button>
          </Col>
          <Col xs={2}>
            <Button size="sm" variant="dark" style={{width: "100%"}}
              disabled={!this.state.loaded}
              > Add </Button>
          </Col>
        </Row>
      </div>
      </>
    )
  }
};

let wrapped = Participation;
export default wrapped;
