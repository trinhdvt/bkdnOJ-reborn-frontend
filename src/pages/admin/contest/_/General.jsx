/* eslint-disable no-unused-vars */
import React from "react";
import {toast} from "react-toastify";
import {Form, Row, Col, Button, Accordion} from "react-bootstrap";

import contestAPI from "api/contest";
import {ErrorBox, RichTextEditor} from "components";
import {withNavigation} from "helpers/react-router";

import UserMultiSelect from "components/SelectMulti/User";
import OrgMultiSelect from "components/SelectMulti/Org";

class General extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ckey: this.props.ckey,
      data: this.props.data,
      errors: null,
    };
  }

  // -------------- Setters Getters
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

  // -------------- apis
  refetch() {
    if (this.props.refetch) this.props.refetch();
  }

  // ------------- Lifecycle
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.data !== this.props.data) {
      this.setState({data: this.props.data});
    }
  }

  // ------------- form submit
  formSubmitHandler(e) {
    e.preventDefault();
    this.setState({errors: null});

    let sendData = {...this.state.data};

    contestAPI
      .updateContest({key: this.state.ckey, data: sendData})
      .then(results => {
        toast.success("OK Updated.");
        if (results.data.key !== this.state.ckey)
          this.props.navigate(`/admin/contest/${results.data.key}`);
        else this.props.refetch();
      })
      .catch(err => {
        toast.error(`Update Failed. (${err.response.status})`);
        this.setState({errors: {errors: err.response.data}});
      });
  }

  render() {
    const {data} = this.state;

    return (
      <>
        <ErrorBox errors={this.state.errors} />
        <Form id="contest-general" onSubmit={e => this.formSubmitHandler(e)}>
          <Row id="contest-id-row">
            <Form.Label column="sm" sm={1}>
              {" "}
              ID{" "}
            </Form.Label>
            <Col sm={2}>
              {" "}
              <Form.Control
                size="sm"
                type="text"
                placeholder="Contest id"
                id="id"
                value={data.id || ""}
                disabled
                readOnly
              />
            </Col>

            <Form.Label column="sm" sm={1} className="required">
              {" "}
              Key{" "}
            </Form.Label>
            <Col sm={8}>
              {" "}
              <Form.Control
                size="sm"
                type="text"
                placeholder="Contest key/shortname/code"
                id="key"
                value={data.key || ""}
                onChange={e => this.inputChangeHandler(e)}
              />
            </Col>
          </Row>
          <Row>
            <Form.Label column="sm" lg={2} className="required">
              {" "}
              T??n cu???c thi{" "}
            </Form.Label>
            <Col>
              {" "}
              <Form.Control
                size="sm"
                type="text"
                placeholder="Contest Name"
                id="name"
                value={data.name || ""}
                onChange={e => this.inputChangeHandler(e)}
              />
            </Col>
          </Row>

          <Accordion defaultActiveKey="-1">
            <Accordion.Item eventKey="-1" className="general">
              <Accordion.Header>Thi???t l???p chung</Accordion.Header>
              <Accordion.Body>
                <Row>
                  <Form.Label column="sm" lg={2} className="required">
                    {" "}
                    Th???i ??i???m b???t ?????u{" "}
                  </Form.Label>
                  <Col lg={4}>
                    {" "}
                    <Form.Control
                      size="sm"
                      type="datetime-local"
                      id="start_time"
                      value={this.getTime("start_time") || ""}
                      onChange={e => this.setTime(e.target.id, e.target.value)}
                    />
                  </Col>

                  <Form.Label column="sm" lg={2} className="required">
                    {" "}
                    Th???i ??i???m k???t th??c{" "}
                  </Form.Label>
                  <Col lg={4}>
                    {" "}
                    <Form.Control
                      size="sm"
                      type="datetime-local"
                      id="end_time"
                      value={this.getTime("end_time") || ""}
                      onChange={e => this.setTime(e.target.id, e.target.value)}
                    />
                  </Col>

                  <Col xl={12}>
                    <sub>
                      Gi???i h???n th???i gian l??m b??i cho tham d??? ch??nh th???c (Live
                      Participation).
                    </sub>
                  </Col>
                </Row>
                {/* <Row>
              <Form.Label column="sm" lg={2}> Time Limit (ph??t) </Form.Label>
              <Col lg={10}> <Form.Control size="sm" id="time_limit"
                      value={data.time_limit || ''} onChange={(e)=>this.inputChangeHandler(e)}
              />
              </Col>
              <Col xl={12}>
                <sub>
                  Gi???i h???n th???i gian l??m b??i cho m???i l???n tham d???. N???u nh???p m???t s??? nguy??n,
                  m???i l???n tham d??? th?? sinh ch??? ???????c l??m b??i t??? Th???i gian Tham d??? c???ng <code>time_limit</code>.
                  Option n??y ch??? y???u d??nh cho Virtual Participation (ch??a tri???n khai).
                </sub>
              </Col>
            </Row> */}

                <Row id="fronzen-settings">
                  <Form.Label column="sm" lg={3}>
                    {" "}
                    ????ng b??ng K???t qu????{" "}
                  </Form.Label>
                  <Col lg={1}>
                    {" "}
                    <Form.Control
                      size="sm"
                      type="checkbox"
                      id="enable_frozen"
                      checked={data.enable_frozen || false}
                      onChange={e =>
                        this.inputChangeHandler(e, {isCheckbox: true})
                      }
                    />
                  </Col>

                  <Form.Label column="sm" lg={3}>
                    {" "}
                    Th???i ??i???m ????ng b??ng{" "}
                  </Form.Label>
                  <Col lg={5}>
                    {" "}
                    <Form.Control
                      size="sm"
                      type="datetime-local"
                      id="frozen_time"
                      value={this.getTime("frozen_time") || ""}
                      onChange={e => this.setTime(e.target.id, e.target.value)}
                    />
                  </Col>

                  <Col xl={12}>
                    <sub>
                      Sau th???i ??i???m ????ng b??ng, th?? sinh kh??ng th???y k???t qu??? c???a
                      submission c???a th?? sinh kh??c, v?? b???ng ??i???m sau s??? kh??ng
                      c???p nh???p k???t qu???. Thay ?????i th???i gian ????ng b??ng m?? kh??ng
                      rejudge s??? kh??ng c???p nh???p l???i ??i???m v?? sub ??ang hi???n tr??n
                      b???ng ??i???m. H??y c??n nh???c khi thay ?????i n?? trong l??c di???n ra
                      contest. Thi???t l???p ????ng b??ng hi???n ch??? c?? t??c d???ng v???i{" "}
                      <code>contest_format</code> ICPC v?? IOI.
                    </sub>
                  </Col>
                </Row>

                <Row id="scoreboard-cache-settings">
                  <Form.Label column="sm" md={4}>
                    {" "}
                    Th???i gian cache b???ng ??i???m (gi??y){" "}
                  </Form.Label>
                  <Col>
                    {" "}
                    <Form.Control
                      size="sm"
                      type="number"
                      id="scoreboard_cache_duration"
                      value={data.scoreboard_cache_duration}
                      onChange={e => this.inputChangeHandler(e)}
                    />
                  </Col>
                  <Col xl={12}>
                    <sub>
                      Th???i gian m?? h??? th???ng s??? cache b???ng ??i???m sau m???i l???n t??nh.
                      N???u gi?? tr??? l?? <code>0</code> s??? t???t caching.
                    </sub>
                  </Col>
                </Row>

                <Row>
                  <Form.Label column="sm" md={2}>
                    {" "}
                    Contest Format{" "}
                  </Form.Label>
                  <Col md={10}>
                    <Form.Select
                      aria-label={data.format_name}
                      value={data.format_name || "icpc"}
                      onChange={e => this.inputChangeHandler(e)}
                      size="sm"
                      id="format_name"
                      className="mb-1 w-100"
                    >
                      {/* <option value="default">M???c ?????nh (t????ng t??? ioi)</option> */}
                      <option value="icpc">ICPC</option>
                      <option value="ioi">IOI</option>
                      {/* <option value="ioi16">IOI (sau 2016)</option> */}
                    </Form.Select>
                  </Col>

                  <Form.Label column="sm" xl={12}>
                    {" "}
                    Contest Format Custom Config{" "}
                  </Form.Label>
                  <Col>
                    {" "}
                    <Form.Control
                      size="sm"
                      xl={12}
                      as="textarea"
                      placeholder="JSON - Describe custom contest rules"
                      id="format_config"
                      value={data.format_config || ""}
                      onChange={e => this.inputChangeHandler(e)}
                    />
                  </Col>
                </Row>

                <Row>
                  <Form.Label column="sm" xl={12}>
                    {" "}
                    M?? t???{" "}
                  </Form.Label>
                  <Col>
                    {/* <Form.Control size="sm" xl={12} as="textarea" placeholder="Contest Description" id="description"
                      value={data.description || ''} onChange={(e) => this.inputChangeHandler(e)}
                  /> */}
                    <RichTextEditor
                      value={data.description || ""}
                      enableEdit={true}
                      onChange={v => {
                        let newData = this.state.data;
                        let key = "description";
                        newData[key] = v;
                        this.setState({data: newData});
                      }}
                    />
                  </Col>
                </Row>

                <Row>
                  <Form.Label column="sm" md={4}>
                    {" "}
                    L??m tr??n ??i???m (?????n s??? th???p ph??n){" "}
                  </Form.Label>
                  <Col>
                    {" "}
                    <Form.Control
                      size="sm"
                      type="number"
                      id="points_precision"
                      value={data.points_precision || 6}
                      onChange={e => this.inputChangeHandler(e)}
                    />
                  </Col>
                </Row>
              </Accordion.Body>
            </Accordion.Item>

            {/* <Accordion.Item eventKey="0" className="options">
            <Accordion.Header>L???a ch???n th??m</Accordion.Header>
            <Accordion.Body>

              <Row>
                <Form.Label column="sm" xs={6}> Ch???m b???ng Pretest? </Form.Label>
                <Col xs={6}> <Form.Control size="sm" type="checkbox" id="run_pretests_only"
                        checked={data.run_pretests_only || false}
                        onChange={(e)=>this.inputChangeHandler(e, {isCheckbox: true})}
                /></Col>
              </Row>

              <Row>
                <Form.Label column="sm" xs={6}> Cho ph??p Thi sinh g???i y??u c???u Clarifications? </Form.Label>
                <Col xs={6}> <Form.Control size="sm" type="checkbox" id="use_clarifications"
                        checked={data.use_clarifications || false}
                        onChange={(e)=>this.inputChangeHandler(e, {isCheckbox: true})}
                /></Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item> */}

            <Accordion.Item eventKey="1" className="accessibility">
              <Accordion.Header>Quy???n truy c???p</Accordion.Header>
              <Accordion.Body>
                <Row>
                  <Form.Label column="sm" md={2} className="required">
                    {" "}
                    Authors{" "}
                  </Form.Label>
                  <Col md={10} className="mt-1 mb-1">
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
                      ?????c quy???n T??c gi???, s??? ???????c quy???n xem v?? ch???nh s???a Contest.
                      T??n t??c gi??? s??? ???????c hi???n th??? c??ng khai.
                      <span className="text-danger">
                        <strong>*C???n th???n!</strong> B???n c?? th??? m???t quy???n Edit
                        Contest n???u b???n x??a b???n th??n kh???i danh s??ch Authors!
                      </span>
                    </sub>
                  </Col>

                  <Form.Label column="sm" md={2}>
                    {" "}
                    Collaborators{" "}
                  </Form.Label>
                  <Col md={10} className="mt-1 mb-1">
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
                      ?????c quy???n C???ng t??c vi??n, s??? ???????c quy???n xem v?? ch???nh s???a
                      Contest. T??n c???ng t??c vi??n s??? kh??ng ???????c hi???n th??? c??ng
                      khai.
                    </sub>
                  </Col>

                  <Form.Label column="sm" md={2}>
                    {" "}
                    Reviewers{" "}
                  </Form.Label>
                  <Col md={10} className="mt-1 mb-1">
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
                      ?????c quy???n Reviewers, ???????c quy???n xem v?? n???p b??i trong
                      Contest.
                    </sub>
                  </Col>
                  <Col xl={12}>
                    <sub>
                      C??c b??i n???p c???a nh???ng th??nh vi??n n??y s??? kh??ng ???????c nh??n
                      th???y b???i Th?? sinh v?? h??? s??? b??? ???n tr??n b???ng x???p h???ng.
                    </sub>
                  </Col>
                </Row>

                <Row>
                  <Form.Label column="sm" xs={6}>
                    {" "}
                    C??ng b????{" "}
                  </Form.Label>
                  <Col xs={6}>
                    {" "}
                    <Form.Control
                      size="sm"
                      type="checkbox"
                      id="published"
                      checked={data.published || false}
                      onChange={e =>
                        this.inputChangeHandler(e, {isCheckbox: true})
                      }
                    />
                  </Col>
                  <Col xl={12}>
                    <sub>
                      C??ng b??? Contest. N???u kh??ng c??ng b???, ch??? c?? 3 nh??m ng?????i
                      d??ng ?????c quy???n tr??n m???i th???y v?? t????ng t??c ??????c. N???u c??
                      C??ng b???, t??y v??o thi???t l???p b??n d?????i m?? quy???t ?????nh quy???n
                      View/Edit/Register.
                    </sub>
                  </Col>
                </Row>

                <Row>
                  <Form.Label column="sm" xs={6}>
                    {" "}
                    C??ng khai cho T???t c????{" "}
                  </Form.Label>
                  <Col xs={6}>
                    {" "}
                    <Form.Control
                      size="sm"
                      type="checkbox"
                      id="is_visible"
                      checked={data.is_visible || false}
                      onChange={e =>
                        this.inputChangeHandler(e, {isCheckbox: true})
                      }
                    />
                  </Col>
                  <Col xl={12}>
                    <sub>
                      Cho ph??p t???t c??? User ?????u th???y contest (c??c Problems khi
                      contest di???n ra, b???ng ??i???m ch??a ????ng b??ng). H??? c??ng c?? th???
                      Register contest n???u c??? hai option b??n d?????i kh??ng ???????c
                      tick.
                    </sub>
                  </Col>
                </Row>

                <Row>
                  <Form.Label column="sm" xs={6}>
                    {" "}
                    Contest ri??ng cho Th?? sinh?{" "}
                  </Form.Label>
                  <Col xs={6}>
                    {" "}
                    <Form.Control
                      size="sm"
                      type="checkbox"
                      id="is_private"
                      checked={data.is_private || false}
                      onChange={e =>
                        this.inputChangeHandler(e, {isCheckbox: true})
                      }
                    />
                  </Col>

                  <Form.Label column="sm" md={2}>
                    {" "}
                    Th?? sinh ri??ng{" "}
                  </Form.Label>
                  <Col md={10} className="mt-1 mb-1">
                    <UserMultiSelect
                      id="private_contestants"
                      value={data.private_contestants || []}
                      onChange={arr =>
                        this.setState({
                          data: {...data, private_contestants: arr},
                        })
                      }
                    />
                  </Col>
                  <Col xl={12}>
                    <sub>
                      Ch??? c?? ph??p c??c Th?? sinh ???????c th??m ????ng k?? Contest v???i t??
                      c??ch Th?? sinh.
                    </sub>
                  </Col>
                </Row>

                <Row>
                  <Form.Label column="sm" xs={6}>
                    {" "}
                    Contest ri??ng cho T??? ch???c?{" "}
                  </Form.Label>
                  <Col xs={6}>
                    {" "}
                    <Form.Control
                      size="sm"
                      type="checkbox"
                      id="is_organization_private"
                      checked={data.is_organization_private || false}
                      onChange={e =>
                        this.inputChangeHandler(e, {isCheckbox: true})
                      }
                    />
                  </Col>

                  <Form.Label column="sm" md={2}>
                    {" "}
                    T??? ch???c
                  </Form.Label>
                  <Col md={10}>
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
                      Cho ph??p th??nh vi??n c???a c??c t??? ch???c ???????c th??m c?? th??? ????ng
                      k?? Contest v???i t?? c??ch Th?? sinh. H??n n???a, c??c Admin c???a
                      c??c t??? ch???c ???????c th??m c?? quy???n Edit contest.
                    </sub>
                  </Col>
                </Row>

                <Row>
                  <Form.Label column="sm" md={2}>
                    {" "}
                    C???m nh???ng th?? sinh n??y{" "}
                  </Form.Label>
                  <Col className="mt-1 mb-1">
                    <UserMultiSelect
                      id="banned_users"
                      value={data.banned_users || []}
                      onChange={arr =>
                        this.setState({data: {...data, banned_users: arr}})
                      }
                    />
                  </Col>
                  <Col xl={12}>
                    <sub>C???m nh???ng th?? sinh n??y n???p b??i.</sub>
                  </Col>
                </Row>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2" className="rating">
              <Accordion.Header>Rating</Accordion.Header>
              <Accordion.Body>
                <Row>
                  <Form.Label column="sm"> X???p h???ng cu???c thi n??y? </Form.Label>
                  <Col>
                    {" "}
                    <Form.Control
                      size="sm"
                      type="checkbox"
                      id="is_rated"
                      checked={data.is_rated || false}
                      onChange={e =>
                        this.inputChangeHandler(e, {isCheckbox: true})
                      }
                    />
                  </Col>
                </Row>

                <Row>
                  <Form.Label column="sm" sm={3}>
                    {" "}
                    Rating Floor{" "}
                  </Form.Label>
                  <Col sm={3}>
                    {" "}
                    <Form.Control
                      size="sm"
                      type="number"
                      placeholder="0"
                      id="rating_floor"
                      value={data.rating_floor || ""}
                      onChange={e => this.inputChangeHandler(e)}
                    />
                  </Col>

                  <Form.Label column="sm" sm={3}>
                    {" "}
                    Rating Ceiling{" "}
                  </Form.Label>
                  <Col sm={3}>
                    {" "}
                    <Form.Control
                      size="sm"
                      type="number"
                      placeholder="999999"
                      id="rating_ceiling"
                      value={data.rating_ceiling || ""}
                      onChange={e => this.inputChangeHandler(e)}
                    />
                  </Col>
                </Row>

                <Row>
                  <Form.Label column="sm"> Rate For All </Form.Label>
                  <Col>
                    {" "}
                    <Form.Control
                      size="sm"
                      type="checkbox"
                      id="rate_all"
                      checked={data.rate_all || false}
                      onChange={e =>
                        this.inputChangeHandler(e, {isCheckbox: true})
                      }
                    />
                  </Col>
                  <Col xl={12}>
                    <sub>
                      ??i???u ch???nh rating c??? nh???ng th?? sinh c?? tham d??? nh??ng kh??ng
                      n???p b??i.
                    </sub>
                  </Col>
                </Row>

                <Row>
                  <Form.Label column="sm" xs={3}>
                    {" "}
                    Kh??ng Rate nh???ng th?? sinh n??y{" "}
                  </Form.Label>
                  <Col xs={9}>
                    <UserMultiSelect
                      id="rate_exclude"
                      value={data.rate_exclude || []}
                      onChange={arr =>
                        this.setState({data: {...data, rate_exclude: arr}})
                      }
                    />
                  </Col>
                  <Col xl={12}>
                    <sub>
                      Ngo??i ra, c??c Th?? sinh b??? c???m thi (banned) v?? t?????c quy???n
                      thi ?????u (disqualified) s??? kh??ng ???????c rate.
                    </sub>
                  </Col>
                </Row>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <Row>
            <Col xl={10}></Col>
            <Col>
              <Button variant="dark" size="sm" type="submit" className="w-100">
                Save
              </Button>
            </Col>
          </Row>
        </Form>
      </>
    );
  }
}

let wrapped = General;
wrapped = withNavigation(wrapped);
export default wrapped;
