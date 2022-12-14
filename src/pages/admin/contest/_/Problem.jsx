import React from "react";
import {toast} from "react-toastify";
import {Link} from "react-router-dom";
import {Form, Row, Col, Table, Button, Modal} from "react-bootstrap";

import contestAPI from "api/contest";

import {ErrorBox, SpinLoader} from "components";
import ProblemSelect from "components/SelectSingle/Problem";

import {
  FaQuestionCircle,
  FaRegPlusSquare,
  FaRegSave,
  FaSortAmountDownAlt,
  FaSortNumericDown,
  FaRedo,
} from "react-icons/fa";

import {qmClarify} from "helpers/components";

const INIT_CONT_PROBLEM = {
  points: 1,
  partial: false,
  is_pretested: false,
  max_submissions: null,
};

class RejudgeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      judgeInfo: null,
      fetchingInfo: false,
      confirmRejudge: false,
    };
  }

  fetchRejudgeInfo() {
    const data = {key: this.props.ckey, shortname: this.props.prob.shortname};
    this.setState({fetchingInfo: true}, () => {
      contestAPI
        .infoRejudgeContestProblem(data)
        .then(res => {
          this.setState({judgeInfo: res.data.msg}, () => {
            let conf = window.confirm(res.data.msg + " Proceed?");
            this.setState({confirmRejudge: conf});
          });
        })
        .catch(err => {
          if (err.response.status === 400)
            toast.error("No submissions to rejudge.");
          else toast.error("Cannot get rejudge info.");
        })
        .finally(() => this.setState({fetchingInfo: false}));
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.confirmRejudge === false &&
      this.state.confirmRejudge === true
    ) {
      const data = {key: this.props.ckey, shortname: this.props.prob.shortname};
      contestAPI
        .rejudgeContestProblem(data)
        .then(() => toast.success(`OK Rejudging ${this.props.prob.shortname}.`))
        .catch(() => toast.error("Cannot rejudge at the moment."));
    }
  }

  clickHandler(e) {
    e.preventDefault();
    if (!this.props.prob.id) return;
    if (this.state.confirmRejudge) {
      alert("Please refresh if you want to re-rejudge this problem.");
      return;
    }
    this.fetchRejudgeInfo();
  }

  render() {
    const {fetchingInfo, confirmRejudge} = this.state;
    const {prob} = this.props;

    return (
      <Link
        to="#"
        onClick={e => this.clickHandler(e)}
        style={!prob.id || confirmRejudge ? {color: "gray"} : {}}
      >
        {fetchingInfo ? <SpinLoader margin="0" /> : <span>Rejudge</span>}
      </Link>
    );
  }
}
class HelpModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {show: false};
  }
  render() {
    return (
      <>
        <Button
          variant="light"
          onClick={() => this.setState({show: true})}
          className="btn-svg"
        >
          <FaQuestionCircle />
        </Button>
        <Modal
          show={this.state.show}
          onHide={() => this.setState({show: false})}
        >
          <Modal.Header>
            <Modal.Title>Ch?? ?? | Contest Problem</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            H??? th???ng ph??n bi???t m???i problem trong contest v???i nhau th??ng qua m??
            problem code (<code>shortname</code>). Khi nh???n SAVE, client s??? g???i
            m???ng Problem ch???a c??c <code>shortname</code> n??y l??n h??? th???ng, l??c
            n??y, c?? 3 tr?????ng h???p s??? x???y ra:
            <ul>
              <li>
                V???i c??c problem code ???? t???n t???i trong contest, h??? th???ng c???p nh???p
                c??c thu???c t??nh kh??c nh?? ??i???m, order,...
              </li>
              <li>
                V???i c??c problem code ch??a c?? trong contest, h??? th???ng t???o m???i ?????i
                t?????ng ContestProblem.
              </li>
              <li>
                V???i c??c problem code c?? trong contest nh??ng kh??ng c?? trong d???
                li???u g???i l??n, h??? th???ng s??? x??a ch??ng.
              </li>
            </ul>
            Nh?? v???y, h??? th???ng ch??? x??a ?????i t?????ng ContestProblem c??ng v???i c??c t??i
            nguy??n li??n quan CH??? KHI b???n nh???n Save m?? t???i giao di???n kh??ng c?? m???t
            Problem m?? ph??a DB ??ang c??. Ch??nh v?? th???, m???t contest c?? ph???n
            Problems ch???nh s???a b???i nhi???u ng?????i c?? th??? g??y ra m??u thu???n ????ng
            ti???c. Nh??n chung, t???t nh???t kh??ng n??n ?????i/x??a Problem khi Contest
            ??ang di???n ra.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="dark" onClick={() => this.setState({show: false})}>
              OK
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

class Problem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ckey: this.props.ckey,
      problems: [],

      loaded: false,
      errors: null,
    };
  }

  refetch() {
    this.setState({errors: null});
    contestAPI
      .getContestProblems({key: this.state.ckey})
      .then(res => {
        this.setState({
          loaded: true,
          problems: res.data.results,
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          loaded: true,
          errors: [err.response.detail],
        });
      });
  }

  componentDidMount() {
    this.refetch();
  }

  // ---------
  clarifyPopup(msg) {
    return (
      <Link to="#" onClick={() => alert(msg)}>
        ?
      </Link>
    );
  }

  // ---------
  problemChangeHandler(idx, e, params = {}) {
    const problems = this.state.problems;
    let prob = {...problems[idx]};

    const isCheckbox = params.isCheckbox || false;
    const isRawObject = params.rawObject || false;

    if (isRawObject) {
      let valid = true;
      problems.forEach((p, i) => {
        if (i === idx) return;
        if (p.shortname === e.shortname) {
          alert("Problem n??y ???? t???n t???i trong contest!");
          valid = false;
        }
      });
      if (!valid) return;
      prob = {...prob, shortname: e.shortname, title: e.title};
    } else if (!isCheckbox) {
      if (e.target.id === "order") prob[e.target.id] = parseInt(e.target.value);
      else prob[e.target.id] = e.target.value;
    } else prob[e.target.id] = !prob[e.target.id];

    this.setState({
      problems: problems.map((p, arridx) => (arridx === idx ? prob : p)),
    });
  }

  // -------- Form Submit
  formSubmitHandler(e) {
    e.preventDefault();

    let conf = window.confirm("B???n c?? ch???c ch???n v???i thay ?????i n??y?");
    if (conf)
      contestAPI
        .updateContestProblems({
          key: this.state.ckey,
          data: this.state.problems,
        })
        .then(() => {
          toast.success("OK Updated.");
          this.refetch();
        })
        .catch(err => {
          console.log(err);
          this.setState({errors: err.response.data});
        });
  }

  render() {
    const {loaded, errors, problems} = this.state;

    return (
      <>
        <div className="table-wrapper m-2">
          <div className="options mb-1">
            <div className="border d-inline-flex p-1">
              <Button
                size="sm"
                variant="dark"
                onClick={() => {
                  let probs = problems.slice();
                  probs.sort((p1, p2) => {
                    const v1 = isNaN(p1.order) ? 9999 : p1.order;
                    const v2 = isNaN(p2.order) ? 9999 : p2.order;
                    return v1 < v2 ? -1 : 0;
                  });
                  this.setState({problems: probs});
                }}
                className="btn-svg"
              >
                <FaSortAmountDownAlt size={14} />{" "}
                <span className="d-none d-sm-inline">S???p x???p theo</span>
                <span>Order</span>
              </Button>
            </div>
            <div className="border d-inline-flex p-1">
              <Button
                size="sm"
                variant="dark"
                onClick={() => {
                  let probs = problems.slice(); // Copy array
                  for (let i = 0; i < problems.length; i++) probs[i].order = i;
                  this.setState({problems: probs});
                }}
                className="btn-svg"
              >
                <FaSortNumericDown size={14} />{" "}
                <span className="d-none d-sm-inline">T??? ????nh s??? Order</span>
                <span className="d-inline d-sm-none">????nh s???</span>
              </Button>
            </div>
            <div className="border d-inline-flex p-1">
              <Button
                size="sm"
                variant="dark"
                onClick={() => {
                  this.setState({errors: null});
                  this.refetch();
                }}
                className="btn-svg"
              >
                <FaRedo size={14} /> <span className="d-inline">Refresh</span>
              </Button>
            </div>
          </div>

          <hr className="m-2" />

          <div className="admin-table">
            <ErrorBox errors={errors} />
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
                  <th style={{whiteSpace: "nowrap"}}>
                    Order{" "}
                    {this.clarifyPopup(
                      "Quy???t ?????nh th??? t??? xu???t hi???n c???a c??c Problem ??? trong Contest. " +
                        "Ngo??i ra, h??? th???ng s??? d???ng gi?? tr??? Order ????? sinh ra nh??n (problem A, problem B,...)."
                    )}
                  </th>

                  <th style={{minWidth: "200px"}}>Problem</th>
                  <th style={{minWidth: "15%"}}>Points</th>
                  <th>
                    <span className="d-none d-lg-inline">??i???m th??nh ph???n</span>
                    <span className="d-inline d-lg-none">??TP</span>
                    {this.clarifyPopup(
                      "Cho ph??p ??i???m th??nh ph???n: cho ph??p ng?????i d??ng ??n ??i???m theo s??? test ????ng. " +
                        "M???c ?????nh kh??ng tick: Nh???n 0?? n???u c?? ??t nh???t m???t test sai."
                    )}
                  </th>
                  {/* <th style={{whiteSpace: "nowrap"}} >
                Pretested {this.clarifyPopup('Ch??? ch???m v???i Pretest.')}
              </th> */}
                  {/* <th style={{whiteSpace: "nowrap"}} >
                Max Subs {this.clarifyPopup('Gi???i h???n s??? l???n n???p b??i t???i ??a cho ph??p. ????? tr???ng n???u cho ph??p n???p kh??ng gi???i h???n.')}
              </th> */}
                  <th>
                    Rejudge
                    {qmClarify(
                      "Ch???m l???i c??c Submissions c???a Problem trong Contest n??y."
                    )}
                  </th>
                  <th></th>
                  {/* <th >
                <Link to="#" onClick={(e) => this.handleDeleteSelect(e)}>Actions</Link>
              </th> */}
                </tr>
              </thead>
              <tbody>
                {!loaded && (
                  <tr>
                    <td colSpan={99}>
                      <SpinLoader margin="20px" />
                    </td>
                  </tr>
                )}
                {loaded && problems.length === 0 && (
                  <tr>
                    <td colSpan={99}>
                      <em>No problems added yet.</em>
                    </td>
                  </tr>
                )}
                {loaded &&
                  problems.length > 0 &&
                  problems.map((prob, ridx) => (
                    <tr key={`ct-pr-${ridx}`}>
                      <td style={{maxWidth: "50px"}}>
                        <Form.Control
                          size="sm"
                          type="number"
                          id="order"
                          value={isNaN(prob.order) ? "" : prob.order}
                          onChange={e => this.problemChangeHandler(ridx, e)}
                        />
                      </td>
                      <td>
                        {/* <Form.Control size="sm" type="text" id="shortname" value={prob.shortname || ''}
                                onChange={(e) => this.problemChangeHandler(ridx, e)} /> */}
                        <ProblemSelect
                          prob={{...prob}}
                          onChange={val =>
                            this.problemChangeHandler(ridx, val, {
                              rawObject: true,
                            })
                          }
                        />
                      </td>
                      <td style={{maxWidth: "50px"}}>
                        <Form.Control
                          size="sm"
                          type="number"
                          id="points"
                          value={prob.points || ""}
                          onChange={e => this.problemChangeHandler(ridx, e)}
                        />
                      </td>
                      <td>
                        {" "}
                        <Form.Control
                          size="sm"
                          type="checkbox"
                          id="partial"
                          checked={prob.partial || false}
                          onChange={e =>
                            this.problemChangeHandler(ridx, e, {
                              isCheckbox: true,
                            })
                          }
                        />
                      </td>
                      {/* <td> <Form.Control size="sm" type="checkbox" id="is_pretested" checked={prob.is_pretested || false}
                                onChange={(e) => this.problemChangeHandler(ridx, e, {isCheckbox: true})} />
                </td> */}
                      {/* <td> <Form.Control size="sm" type="number" id="max_submissions" value={prob.max_submissions || ''}
                                onChange={(e) => this.problemChangeHandler(ridx, e)} />
                </td> */}

                      <td>
                        <RejudgeButton
                          ridx={ridx}
                          prob={prob}
                          ckey={this.state.ckey}
                        />
                      </td>

                      <td>
                        <Link
                          to="#"
                          onClick={e => {
                            e.preventDefault();
                            if (!prob.id) {
                              this.setState({
                                problems: problems.filter((_, i) => i !== ridx),
                              });
                              return;
                            }

                            let conf = window.confirm(
                              "CH?? ??: X??a m???t ?????i t?????ng ContestProblem c?? s???n s??? " +
                                "g??y ???nh h?????ng ?????n nh???ng t??i nguy??n kh??c, nh???t l?? khi Contest ??ang v?? ???? di???n ra. " +
                                "H??y suy x??t l???a ch???n ?????i th??? t??? ch??ng th??ng qua Order thay v?? x??a ??i t???o l???i m???t Problem. " +
                                "??? phi??n b???n hi???n t???i, m???t khi nh???n SAVE, s??? kh??ng th??? kh??i ph???c l???i nh???ng g?? ???? m???t."
                            );
                            if (conf)
                              this.setState({
                                problems: problems.filter((_, i) => i !== ridx),
                              });
                          }}
                        >
                          Delete
                        </Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </div>

          <Row className="mt-2">
            <Col className="d-inline-flex">
              <HelpModal />
            </Col>

            <Col xs={8} className="d-inline-flex flex-row-reverse">
              <Button
                size="sm"
                variant="danger"
                className="ml-1 mr-1 btn-svg"
                onClick={e => this.formSubmitHandler(e)}
              >
                <FaRegSave size={16} />{" "}
                <span className="d-none d-sm-inline">Save</span>
              </Button>

              <Button
                size="sm"
                variant="dark"
                className="ml-1 mr-1 btn-svg"
                onClick={() =>
                  this.setState({
                    problems: problems.concat({...INIT_CONT_PROBLEM}),
                  })
                }
              >
                <FaRegPlusSquare size={16} />{" "}
                <span className="d-none d-sm-inline">Add</span>
              </Button>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

let wrapped = Problem;
export default wrapped;
