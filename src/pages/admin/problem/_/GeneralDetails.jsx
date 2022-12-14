import React from "react";
import {Accordion, Form, Row, Col, Button} from "react-bootstrap";

import {FaRegSave} from "react-icons/fa";

import {toast} from "react-toastify";

import problemAPI from "api/problem";
import {withNavigation} from "helpers/react-router";
import {SpinLoader, FileUploader, RichTextEditor} from "components";

import UserMultiSelect from "components/SelectMulti/User";
import OrgMultiSelect from "components/SelectMulti/Org";
import {qmClarify} from "helpers/components";

class GeneralDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      selectedPdf: null,
      submitting: false,
    };
  }
  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.setState({data: this.props.data});
    }
  }

  setSelectedPdf(file) {
    this.setState({selectedPdf: file});
  }

  inputChangeHandler(event, params = {isCheckbox: null}) {
    const isCheckbox = params.isCheckbox || false;

    let newData = this.state.data;
    if (!isCheckbox) newData[event.target.id] = event.target.value;
    else {
      newData[event.target.id] = !newData[event.target.id];
    }
    this.setState({data: newData});
  }
  getTime(key) {
    const data = this.state.data;
    if (data && data[key]) {
      let time = new Date(data[key]);
      time.setMinutes(time.getMinutes() - time.getTimezoneOffset());
      return time.toISOString().slice(0, 16);
    }
    return "";
  }
  setTime(key, v) {
    let time = new Date(v);
    const data = this.state.data;
    this.setState({data: {...data, [key]: time.toISOString()}});
  }
  setContent(v) {
    const {data} = this.state;
    this.setState({data: {...data, content: v}});
  }

  formSubmitHandler(e) {
    e.preventDefault();
    if (this.state.submitting) return;
    if (this.props.setErrors) {
      this.props.setErrors(null);
    }

    // eslint-disable-next-line no-unused-vars
    let {pdf, ...sendData} = this.state.data;
    delete sendData.allowed_languages;
    let reqs = [];

    console.log(sendData);

    reqs.push(
      problemAPI.adminEditProblemDetails({
        shortname: this.props.shortname,
        data: sendData,
      })
    );

    if (this.state.selectedPdf) {
      const formData = new FormData();
      formData.append("pdf", this.state.selectedPdf);
      reqs.push(
        problemAPI.adminEditProblemDetailsForm({
          shortname: this.props.shortname,
          formData,
        })
      );
    }

    Promise.all(reqs)
      .then(results => {
        toast.success("OK Updated.");
        this.setState({
          data: results[0].data,
          submitting: false,
        });
        this.props.setProblemTitle &&
          this.props.setProblemTitle(results[0].data.title);
        if (results[0].data.shortname !== this.props.shortname) {
          this.props.refetch(results[0].data.shortname);
          this.props.navigate(`/admin/problem/${results[0].data.shortname}`);
        } else this.props.refetch();
      })
      .catch(err => {
        const data = err.response.data;
        this.setState({submitting: false});
        if (this.props.setErrors) {
          this.props.setErrors({errors: data});
        }
      });
  }

  render() {
    const {data} = this.state;
    return (
      <Form id="problem-general" onSubmit={e => this.formSubmitHandler(e)}>
        <Row className="options m-1 border">
          <Col>
            {this.state.submitting && (
              <span className="loading_3dot">??ang x??? l?? y??u c???u</span>
            )}
          </Col>
        </Row>
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0" className="general">
            <Accordion.Header>Thi???t l???p chung</Accordion.Header>
            <Accordion.Body>
              {/* <Row>
                <Form.Label column="sm" lg={2}> Resource URL </Form.Label>
                <Col> <Form.Control size="sm" type="text" placeholder="Problem URL" id="url"
                        value={data.url} disabled
                /></Col>
              </Row> */}
              <Row>
                <Form.Label column="sm" md={2} className="required">
                  {" "}
                  Problem Code{" "}
                </Form.Label>
                <Col md={3}>
                  {" "}
                  <Form.Control
                    size="sm"
                    type="text"
                    placeholder="Problem Code"
                    id="shortname"
                    value={data.shortname}
                    onChange={e => this.inputChangeHandler(e)}
                    required
                  />
                </Col>

                <Form.Label column="sm" md={1} className="required">
                  {" "}
                  Title{" "}
                </Form.Label>
                <Col md={6}>
                  {" "}
                  <Form.Control
                    size="sm"
                    type="text"
                    placeholder="Problem Title"
                    id="title"
                    value={data.title}
                    onChange={e => this.inputChangeHandler(e)}
                    required
                  />
                </Col>
              </Row>
              <Row>
                <Form.Label column="sm" md={2}>
                  {" "}
                  Ng??y t???o{" "}
                </Form.Label>
                <Col>
                  {" "}
                  <Form.Control
                    size="sm"
                    type="datetime-local"
                    id="created"
                    onChange={e => this.setTime(e.target.id, e.target.value)}
                    value={this.getTime("created") || ""}
                  />
                </Col>
              </Row>

              <Row>
                <Form.Label column="sm" lg={12}>
                  {" "}
                  Problem Statement{" "}
                </Form.Label>
                <Col className="pb-2">
                  <RichTextEditor
                    value={data.content || ""}
                    onChange={v => this.setContent(v)}
                    enableEdit={true}
                  />
                </Col>
              </Row>
              <Row>
                <Form.Label column="sm" xl={12}>
                  {" "}
                  PDF{" "}
                </Form.Label>
                <Col md={6}>
                  {data.pdf ? (
                    <a href={data.pdf} className="text-truncate">
                      {data.pdf}
                    </a>
                  ) : (
                    "None"
                  )}
                </Col>
                <Col md={6}>
                  <FileUploader
                    onFileSelectSuccess={file => this.setSelectedPdf(file)}
                    onFileSelectError={({error}) => alert(error)}
                  />
                </Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="1" className="problem-access-control">
            <Accordion.Header>Quy???n truy c???p</Accordion.Header>
            <Accordion.Body>
              <Row>
                <Form.Label column="sm" sm={3} className="required">
                  {" "}
                  Authors{" "}
                </Form.Label>
                <Col>
                  <UserMultiSelect
                    id="authors"
                    value={data.authors || []}
                    onChange={arr =>
                      this.setState({data: {...data, authors: arr}})
                    }
                  />
                </Col>
                <Col xl={12}>
                  <sub>
                    ?????c quy???n T??c gi???, T??c gi??? c?? th??? th???y v?? edit ???????c Problem.
                    T??n s??? hi???n th??? c??ng khai.
                  </sub>
                  <sub className="text-danger">
                    <strong> *C???n th???n!</strong> B???n c?? th??? m???t quy???n Edit
                    problem n??y n???u b???n x??a b???n th??n ra kh???i danh s??ch Authors!
                  </sub>
                </Col>
              </Row>
              <Row>
                <Form.Label column="sm" sm={3}>
                  {" "}
                  Collaborators{" "}
                </Form.Label>
                <Col>
                  <UserMultiSelect
                    id="collaborators"
                    value={data.collaborators || []}
                    onChange={arr =>
                      this.setState({data: {...data, collaborators: arr}})
                    }
                  />
                </Col>
                <Col xl={12}>
                  <sub>
                    ?????c quy???n C???ng t??c vi??n, C???ng t??c vi??n c?? th??? th???y v?? edit
                    ???????c Problem. T??n s??? ???????c ???n kh???i c??ng khai.
                  </sub>
                </Col>
              </Row>
              <Row>
                <Form.Label column="sm" sm={3}>
                  {" "}
                  Reviewers{" "}
                </Form.Label>
                <Col>
                  <UserMultiSelect
                    id="reviewers"
                    value={data.reviewers || []}
                    onChange={arr =>
                      this.setState({data: {...data, reviewers: arr}})
                    }
                  />
                </Col>
                <Col xl={12}>
                  <sub>
                    ?????c quy???n Reviewer, Reviewer c?? th??? th???y v?? n???p b??i ???????c.
                  </sub>
                </Col>
              </Row>

              <Row>
                <Form.Label column="sm" sm={3}>
                  {" "}
                  C??ng khai?{" "}
                </Form.Label>
                <Col sm={9}>
                  <Form.Control
                    size="sm"
                    type="checkbox"
                    id="is_public"
                    checked={data.is_public}
                    onChange={e =>
                      this.inputChangeHandler(e, {isCheckbox: true})
                    }
                  />
                </Col>
                <Col xl={12}>
                  <sub>
                    C??ng khai cho <strong>public ho???c cho c??c t??? ch???c</strong>.
                    N???u kh??ng tick, ch??? c?? 3 nh??m ?????c quy???n k??? tr??n m???i truy c???p
                    ???????c problem.
                  </sub>
                </Col>
              </Row>

              <Row>
                <Form.Label column="sm" sm={3}>
                  {" "}
                  Ch??? C??ng khai cho T??? ch???c?{" "}
                </Form.Label>
                <Col sm={9}>
                  <Form.Control
                    size="sm"
                    type="checkbox"
                    id="is_organization_private"
                    checked={data.is_organization_private}
                    onChange={e =>
                      this.inputChangeHandler(e, {isCheckbox: true})
                    }
                  />
                </Col>

                <Form.Label column="sm" sm={3}>
                  {" "}
                  T??? ch???c{" "}
                </Form.Label>
                <Col sm={9}>
                  <OrgMultiSelect
                    id="organizations"
                    value={data.organizations || []}
                    onChange={arr =>
                      this.setState({data: {...data, organizations: arr}})
                    }
                  />
                </Col>

                <Col xl={12}>
                  <sub>
                    Ch??? c?? t??c d???ng n???u <strong>problem ??ang C??ng khai</strong>.
                    N???u <strong>c?? tick, ch??? nh???ng th??nh vi??n </strong>
                    c???a T??? ch???c ???????c th??m v?? nh???ng T??? ch???c con th???y ???????c
                    problem. Ngo??i ra, nh???ng admin c???a t??? ch???c s??? edit ???????c
                    problem.
                  </sub>
                </Col>
              </Row>
              <Row>
                <Form.Label column="sm" lg={4}>
                  {" "}
                  Ch??nh s??ch xem chi ti???t Submission{" "}
                </Form.Label>
                <Col>
                  <Form.Select
                    aria-label={data.submission_visibility_mode}
                    value={data.submission_visibility_mode || ""}
                    onChange={e => this.inputChangeHandler(e)}
                    size="sm"
                    id="submission_visibility_mode"
                    className="mb-1 w-100"
                  >
                    <option value="FOLLOW">
                      Default (Ch??? th???y c???a b???n th??n)
                    </option>
                    <option value="ALWAYS">User th???y t???t c??? Submission</option>
                    <option value="SOLVED">
                      User ch??? th???y Sub b???n th??n, n???u gi???i ???????c s??? th???y Sub
                      ng?????i kh??c.
                    </option>
                    <option value="ONLY_OWN">
                      User ch??? th???y Sub c???a b???n th??n
                    </option>
                    <option value="HIDDEN">
                      Kh??ng cho ph??p xem chi ti???t Sub
                    </option>
                  </Form.Select>
                </Col>

                <Col xl={12}>
                  <sub>
                    Ch??nh s??ch hi???n th??? chi ti???t Submission c???a Problem n??y ch???
                    c?? t??c d???ng v???i c??c User m?? c?? quy???n view problem.
                  </sub>
                </Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="2" className="constraints-scoring">
            <Accordion.Header>R???ng bu???c v?? T??nh ??i???m</Accordion.Header>
            <Accordion.Body>
              <Row>
                <Form.Label column="sm" xs={4}>
                  {" "}
                  Time Limit (s)
                </Form.Label>
                <Col>
                  {" "}
                  <Form.Control
                    size="sm"
                    type="text"
                    placeholder="1.0"
                    id="time_limit"
                    value={data.time_limit}
                    onChange={e => this.inputChangeHandler(e)}
                  />
                </Col>
              </Row>
              <Row>
                <Form.Label column="sm" xs={4}>
                  {" "}
                  Memory Limit (KBs)
                </Form.Label>
                <Col>
                  <Form.Control
                    size="sm"
                    type="number"
                    placeholder="256000"
                    id="memory_limit"
                    value={data.memory_limit}
                    onChange={e => this.inputChangeHandler(e)}
                  />
                </Col>
              </Row>

              <Row>
                <Form.Label column="sm" xs={6}>
                  ICPC
                  {qmClarify(
                    "D???ng ch???m b??i n???u c?? m???t test cho k???t qu??? sai. Option n??n tick cho khi " +
                      "problem n???m trong contest ICPC, ho???c problem c?? nhi???u test."
                  )}{" "}
                </Form.Label>
                <Col xs={6}>
                  <Form.Control
                    size="sm"
                    type="checkbox"
                    id="short_circuit"
                    checked={data.short_circuit}
                    onChange={e =>
                      this.inputChangeHandler(e, {isCheckbox: true})
                    }
                  />
                </Col>
                <Col xl={12}>
                  <sub>
                    D???ng ch???m b??i n???u submission cho ra m???t test cho k???t qu???
                    kh??ng ???????c ch???p nh???n.
                  </sub>
                </Col>
              </Row>

              <sub>
                Nh???ng thi???t l???p d?????i ????y ch??? c?? t??c d???ng khi n???p ??? Practice
              </sub>
              <Row>
                <Form.Label column="sm" xs={2}>
                  {" "}
                  ??i???m{" "}
                </Form.Label>
                <Col>
                  <Form.Control
                    size="sm"
                    type="number"
                    id="points"
                    value={data.points}
                    onChange={e => this.inputChangeHandler(e)}
                  />
                </Col>
              </Row>
              <Row>
                <Form.Label column="sm" xs={6}>
                  {" "}
                  Cho ph??p ??n ??i???m t???ng test{" "}
                </Form.Label>
                <Col xs={6}>
                  <Form.Control
                    size="sm"
                    type="checkbox"
                    id="partial"
                    checked={data.partial}
                    onChange={e =>
                      this.inputChangeHandler(e, {isCheckbox: true})
                    }
                  />
                </Col>
                <Col xl={12}>
                  <sub>
                    Cho ph??p ??n ??i???m theo t???ng test ????ng. N???u kh??ng tick th??
                    ng?????i d??ng ch??? c?? th??? ???????c 0?? ho???c full ??i???m.
                  </sub>
                </Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <Row>
          <Col xl={10}></Col>
          <Col className="justify-content-end">
            <Button variant="dark" size="sm" type="submit" className="btn-svg">
              <FaRegSave /> Save
            </Button>
            {this.state.submitting && (
              <SpinLoader size={20} margin="auto 0 auto 15px" />
            )}
          </Col>
        </Row>
      </Form>
    );
  }
}
let wrapped = GeneralDetails;
wrapped = withNavigation(wrapped);
export default wrapped;
