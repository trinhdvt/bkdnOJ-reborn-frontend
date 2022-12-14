import React from "react";
import {Link} from "react-router-dom";
import {Form, Row, Col, Table, Button, Modal} from "react-bootstrap";
import ReactPaginate from "react-paginate";

import {getLocalDateWithTimezone} from "helpers/dateFormatter";

import {SpinLoader, ErrorBox} from "components";
import contestAPI from "api/contest";
import "styles/ClassicPagination.scss";

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
  // modal
};
const VIRTUAL_TYPE = ["LIVE", "SPECTATE"];

class Participation extends React.Component {
  constructor(props) {
    super(props);
    this.ckey = this.props.ckey;
    this.state = {
      ...INITIAL_STATE,
      modalShow: false,
    };
  }
  openModalHandler() {
    this.setState({modalShow: true});
  }
  closeModalHandler() {
    this.setState({modalShow: false});
  }

  resetFetch() {
    this.setState(INITIAL_STATE, () => this.refetch());
  }

  clarifyPopup(msg) {
    return (
      <Link to="#" onClick={() => alert(msg)}>
        ?
      </Link>
    );
  }

  refetch(params = {page: 0}) {
    this.setState({loaded: false, errors: null});
    let prms = {page: params.page + 1};

    if (this.state.virtual) prms.virtual = this.state.virtual;

    contestAPI
      .getContestParticipations({key: this.ckey, params: prms})
      .then(res => {
        this.setState({
          participations: res.data.results,
          count: res.data.count,
          pageCount: res.data.total_pages,
          currPage: params.page,

          selectChk: Array(res.data.results.length).fill(false),
          loaded: true,
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          loaded: true,
          errors: ["Cannot fetch Participations for this contest."],
        });
      });
  }

  handlePageClick = event => {
    this.refetch({page: event.selected});
  };

  componentDidMount() {
    this.refetch();
  }

  render() {
    const {participations} = this.state;
    return (
      <>
        <div className="table-wrapper m-2">
          <div className="options border m-1 p-1">
            <Row className="flex-center">
              <Col className="d-inline-flex" md={4}>
                <div className="mr-2">Participation Type:</div>
              </Col>
              <Col className="d-inline-flex" md={8}>
                {VIRTUAL_TYPE.map(type => (
                  <div key={`part-${type}`} className="flex-center-col">
                    <Form.Check
                      inline
                      name="participation-type"
                      type="radio"
                      id={`${type}`}
                      label={`${type}`}
                      checked={type === this.state.virtual}
                      onChange={e => this.setState({virtual: e.target.id})}
                    />
                  </div>
                ))}
              </Col>
            </Row>
            <Row className="mb-1">
              <Col md={8}></Col>
              <Col className="flex-center">
                <Button
                  size="sm"
                  variant="dark"
                  style={{width: "100%"}}
                  onClick={() => this.resetFetch()}
                >
                  {" "}
                  Reset{" "}
                </Button>
              </Col>
              <Col className="flex-center">
                <Button
                  size="sm"
                  variant="dark"
                  style={{width: "100%"}}
                  disabled={!this.state.loaded}
                  onClick={() => this.refetch()}
                >
                  {" "}
                  Search{" "}
                </Button>
              </Col>
            </Row>
          </div>
          <hr className="m-2" />
          <div className="admin-table contest-participation-table">
            <h4 className="m-0">Participations</h4>
            <Table
              responsive
              hover
              size="sm"
              striped
              bordered
              className="rounded mb-0"
            >
              <thead>
                <tr>
                  <th>#</th>
                  <th>User</th>
                  <th>When</th>
                  <th>
                    Type{" "}
                    {this.clarifyPopup(
                      "H??nh th???c tham d??? c???a th?? sinh. \n* -1 -> SPECTATE, ch??? theo d??i, k???t qu??? kh??ng ???????c t??nh\n" +
                        "* 0 -> LIVE, th?? sinh tham d??? ch??nh th???c\n* kh??c -> VIRTUAL, th?? sinh tham d??? kh??ng ch??nh " +
                        "th???c, sau khi contest ???? k???t th??c."
                    )}
                  </th>
                  <th>
                    Disqualified{" "}
                    {this.clarifyPopup(
                      "Nh???ng l???n tham d??? b??? Disqualified n??y s??? mang ??i???m l?? -9999 tr??n b???ng x???p h???ng. " +
                        "N???u l?????t tham d??? n??y l?? LIVE, th?? sinh n??y s??? kh??ng ???????c x???p h???ng Rating."
                    )}
                  </th>
                </tr>
              </thead>
              <tbody>
                {" "}
                {participations.map(part => (
                  <tr key={`ct-part-${part.id}`}>
                    <td>{part.id}</td>
                    <td>{part.user}</td>
                    <td>{getLocalDateWithTimezone(part.real_start)}</td>
                    <td>{part.virtual}</td>
                    <td>{part.is_disqualified ? "Yes" : "No"}</td>
                  </tr>
                ))}{" "}
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
                  pageRangeDisplayed={3}
                  pageCount={this.state.pageCount}
                  renderOnZeroPageCount={null}
                  previousLabel={null}
                  nextLabel={null}
                />
              </span>
            )}
          </div>

          <Row className="mt-2">
            <Col md={8}></Col>
            <Col>
              <Button
                size="sm"
                variant="dark"
                style={{width: "100%"}}
                onClick={() => this.openModalHandler()}
              >
                {" "}
                Add{" "}
              </Button>
            </Col>
            <Col>
              <Button
                size="sm"
                variant="danger"
                style={{width: "100%"}}
                disabled={!this.state.loaded}
              >
                {" "}
                Save{" "}
              </Button>
            </Col>
          </Row>
        </div>
        <AddParticipationModal
          ckey={this.ckey}
          modalShow={this.state.modalShow}
          closeModalHandler={() => this.closeModalHandler()}
          refetch={() => this.refetch()}
        />
      </>
    );
  }
}

class AddParticipationModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addPartType: null,
      users: "",
      submitting: false,
      errors: null,
    };
  }

  submitHandler(e) {
    e.preventDefault();

    let {addPartType, users} = this.state;
    if (!addPartType) {
      alert("H??y ch???n 1 t?? c??ch tham d???.");
      return false;
    }
    users.trim();
    if (users.length === 0) {
      alert("H??y th??m ??t nh???t 1 ng?????i d??ng.");
      return false;
    }
    users = users.split(/\s+/).filter(u => u !== "");

    this.setState({submitting: true, errors: null});

    const data = {users, participation_type: addPartType};
    contestAPI
      .addContestParticipations({key: this.props.ckey, data})
      .then(() => {
        this.props.closeModalHandler();
        this.props.refetch();
        this.setState({submitting: false});
      })
      .catch(err => {
        this.setState({
          errors: err.response.data,
          submitting: false,
        });
      });
  }

  closeModalHandler() {
    this.setState({submitting: false, errors: null});
    this.props.closeModalHandler();
  }

  render() {
    const {addPartType, users, submitting, errors} = this.state;

    return (
      <Modal
        show={this.props.modalShow}
        onHide={() => this.closeModalHandler()}
      >
        <Modal.Header>
          <Modal.Title>Th??m Participation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ErrorBox errors={errors} />
          <Form
            id="contest-participation-add-form"
            onSubmit={e => this.submitHanlder(e)}
          >
            <div className="">Th??m h??? v???i t?? c??ch tham d???:</div>
            <div className="flex-center">
              {VIRTUAL_TYPE.map(type => (
                <div key={`part-${type}`} className="flex-center">
                  <Form.Check
                    inline
                    name="add-participation-type"
                    type="radio"
                    id={`add-participation-type-${type}`}
                    label={`${type}`}
                    checked={type === addPartType}
                    onChange={() => this.setState({addPartType: type})}
                  />
                </div>
              ))}
            </div>

            <Form.Control
              as="textarea"
              style={{height: "100px"}}
              placeholder="username1 username2 username3"
              value={users}
              onChange={e => this.setState({users: e.target.value})}
            />
            <div className="flex-center">
              <em style={{fontSize: "12px"}}>
                D??n nh???ng t??n ng?????i d??ng (space-separated) m?? b???n mu???n ????ng k??
                v??o contest. N???u c?? ng?????i d??ng ???????c th??m ???? ????ng k?? (v???i t?? c??ch
                l?? LIVE ho???c SPECTATE), h??? th???ng s??? ch???nh l???i Participation Type
                c???a h???.
              </em>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={() => this.closeModalHandler()}>
            ????ng
          </Button>
          <Button
            variant="danger"
            disabled={submitting}
            onClick={e => this.submitHandler(e)}
          >
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

let wrapped = Participation;
export default wrapped;
