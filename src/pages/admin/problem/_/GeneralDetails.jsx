import React from 'react';
import { Navigate } from 'react-router-dom';
import { Accordion, Form, Row, Col, Tabs, Tab, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

import problemAPI from 'api/problem';
import { FileUploader } from 'components';

export default class GeneralDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shortname: this.props.shortname,
      data: this.props.data,
      options: this.props.options.actions.PUT || this.props.options.actions.PATCH,
      selectedPdf: null
    }
  }
  setSelectedPdf(file) {
    this.setState({selectedPdf: file})
  }

  inputChangeHandler(event, params={isCheckbox: null}) {
    const isCheckbox = params.isCheckbox || false;

    let newData = this.state.data;
    if (!isCheckbox) newData[event.target.id] = event.target.value
    else {
      newData[event.target.id] = !newData[event.target.id]
    }
    this.setState({ data : newData })
  }

  formSubmitHandler(e) {
    e.preventDefault();
    let {pdf, ...sendData} = this.state.data;
    delete sendData.allowed_languages
    let reqs = [];

    reqs.push(
      problemAPI.adminEditProblemDetails({
        shortname: this.state.shortname,
        data: sendData,
      })
    )
    if (this.state.selectedPdf) {
      const formData = new FormData();
      formData.append("pdf", this.state.selectedPdf);
      reqs.push(
        problemAPI.adminEditProblemDetailsForm({
          shortname: this.state.shortname, formData
        })
      )
    }

    Promise.all(
      reqs
    ).then((results) => {
      toast.success("Saved.")
      this.setState({ data: results[0].data });
      this.props.setProblemTitle && this.props.setProblemTitle(results[0].data.title)
      // console.log(results);
    }).catch((err) => {
      console.log(err);
    })
  }

  render() {
    const {data} = this.state;
    // console.log(data);
    return (
      <Form id="problem-general" onSubmit={(e) => this.formSubmitHandler(e)}>
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0" className="general">
          <Accordion.Header>Thiết lập chung</Accordion.Header>
          <Accordion.Body>
            <Row>
              <Form.Label column="sm" lg={2}> Resource URL </Form.Label>
              <Col> <Form.Control size="sm" type="text" placeholder="Problem URL" id="url"
                      value={data.url} disabled
              /></Col>
            </Row>
            <Row>
              <Form.Label column="sm" xs={3} className="required" > Title </Form.Label>
              <Col> <Form.Control size="sm" type="text" placeholder="Problem Title" id="title"
                      value={data.title} onChange={(e) => this.inputChangeHandler(e)} required
              /></Col>
            </Row>
            <Row>
              <Form.Label column="sm" xs={3} className="required"> Shortname </Form.Label>
              <Col> <Form.Control size="sm" type="text" placeholder="Problem Shortname" id="shortname"
                      value={data.shortname} onChange={(e) => this.inputChangeHandler(e)} required
              /></Col>
            </Row>
            <Row>
              <Form.Label column="sm" lg={12}> Content (LateX) </Form.Label>
              <Col> <Form.Control size="sm" lg={12} type="textarea" placeholder="Problem Statement" id="content"
                      value={data.content} onChange={(e) => this.inputChangeHandler(e)}
              /></Col>
            </Row>
            <Row>
              <Form.Label column="sm" lg={12}> PDF </Form.Label>
              <Col >
              <div className="border col-lg-12 pb-1 mb-1">
              {
                data.pdf ? <a href={data.pdf} className="text-truncate">{data.pdf}</a>
                  : "Not Available"
              }
              <FileUploader
                onFileSelectSuccess={(file) => this.setSelectedPdf(file)}
                onFileSelectError={({ error }) => alert(error)}
              />
              </div>
              </Col>
            </Row>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1" className="problem-access-control">
          <Accordion.Header>Accessibility Settings</Accordion.Header>
          <Accordion.Body>
            <Row>
              <Form.Label column="sm" sm={3} className="required"> Authors </Form.Label>
              <Col> <Form.Control size="sm" type="text" placeholder="authors" id="authors"
                      value={JSON.stringify(data.authors)} disabled
              /></Col>
            </Row>
            <Row>
              <Form.Label column="sm" sm={3}> Collaborators </Form.Label>
              <Col> <Form.Control size="sm" type="text" placeholder="collaborators" id="collaborators"
                      value={JSON.stringify(data.collaborators)} disabled
              /></Col>
            </Row>
            <Row>
              <Form.Label column="sm" sm={3}> Reviewers </Form.Label>
              <Col> <Form.Control size="sm" type="text" placeholder="reviewers" id="reviewers"
                      value={JSON.stringify(data.reviewers)} disabled
              /></Col>
            </Row>

            <Row>
              <Form.Label column="sm" sm={3}> Only public to organizations </Form.Label>
              <Col >
                <Form.Control size="sm" type="checkbox" id="is_privated_to_orgs"
                  checked={data.is_privated_to_orgs} onChange={(e) => this.inputChangeHandler(e, {isCheckbox: true})}
                />
              </Col>
            </Row>
            <Row>
              <Form.Label column="sm" sm={3}> Organizations </Form.Label>
              <Col> <Form.Control size="sm" type="text" placeholder="organizations" id="organizations"
                      value={JSON.stringify(data.organizations)} disabled
              /></Col>
            </Row>
            <Row>
              <Form.Label column="sm" lg={4}> Submission Visibility Mode </Form.Label>
              <Col>
                  <Form.Select aria-label={data.submission_visibility_mode}
                    defaultValue={data.submission_visibility_mode || 'FOLLOW'}
                    size="sm" id="submission_visibility_mode"
                    className="mb-1"
                  >
                    <option value="FOLLOW">Follow bkdnOJ's setting.</option>
                    <option value="ALWAYS">Users can see all submissions</option>
                    <option value="SOLVED">Users can see their own, plus see others if user has solved that problem.</option>
                    <option value="ONLY_OWN">Users can only see their own submissions.</option>
                    <option value="HIDDEN">Submissions will never be visible.</option>
                  </Form.Select>
              </Col>
            </Row>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="2" className="constraints-scoring">
          <Accordion.Header>Constraints and Scoring</Accordion.Header>
          <Accordion.Body>
            <Row>
              <Form.Label column="sm" xs={4}> Time Limit (s)</Form.Label>
              <Col> <Form.Control size="sm" type="text" placeholder="1.0" id="time_limit"
                      value={data.time_limit} onChange={(e) => this.inputChangeHandler(e)}
              /></Col>
            </Row>
            <Row>
              <Form.Label column="sm" xs={4}> Memory Limit (KBs)</Form.Label>
              <Col>
              <Form.Control size="sm" type="number" placeholder="256000" id="memory_limit"
                      value={data.memory_limit} onChange={(e) => this.inputChangeHandler(e)}
              /></Col>
            </Row>

            <sub>Những thiết lập dưới đây chỉ có tác dụng khi nộp ở bên ngoài contest (nộp ở trang Problem)</sub>
            <Row>
              <Form.Label column="sm" xs={2}> Điểm </Form.Label>
              <Col >
                <Form.Control size="sm" type="number" id="points"
                  value={data.points} onChange={(e) => this.inputChangeHandler(e)}
                />
              </Col>
            </Row>
            <Row>
              <Form.Label column="sm" xs={6}> Dừng chấm nếu có test sai </Form.Label>
              <Col >
                <Form.Control size="sm" type="checkbox" id="short_circuit"
                  checked={data.short_circuit} onChange={(e) => this.inputChangeHandler(e, {isCheckbox: true})}
                />
                {/* <sub>Dừng chấm bài nếu có một test cho kết quả không được chấp nhận.</sub> */}
              </Col>
            </Row>
            <Row>
              <Form.Label column="sm" xs={6}> Cho phép ăn điểm từng test </Form.Label>
              <Col >
                <Form.Control size="sm" type="checkbox" id="partial"
                  checked={data.partial} onChange={(e) => this.inputChangeHandler(e, {isCheckbox: true})}
                />
                {/* <sub>Cho phép ăn điểm theo từng test đúng. Nếu không tick thì người dùng chỉ có thể được 0đ hoặc full điểm.</sub> */}
              </Col>
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <hr className="m-2" />

      <Row>
        <Col lg={10}>
          <sub>**Các thiết lập khác sẽ được thêm sau.</sub>
        </Col>
        <Col >
          <Button variant="dark" size="sm" type="submit" className="mb-1">
            Save
          </Button>
        </Col>
      </Row>
      </Form>
    )
  }
}
