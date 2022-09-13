import React from "react";
import {Link} from "react-router-dom";
import {Form, Accordion, Button, Table, Row, Col} from "react-bootstrap";
import {ErrorBox, SpinLoader} from "components";
import {VscRefresh} from "react-icons/vsc";

import problemAPI from "api/problem";
import TestcaseEditor from "./TestcaseEditor";

class TestcaseItem extends React.Component {
  render() {
    const {
      order,
      input_file,
      output_file,
      points,
      is_pretest,
      onPretestToggle,
      isSelected,
      onSelectChkChange,
      input_preview,
      output_preview,
      onEditLinkClick,
    } = this.props;

    return (
      <tr>
        <td>{order}</td>
        <td>
          <pre className="mb-0" style={{backgroundColor: "#d6d6d6"}}>
            {input_preview}
          </pre>
        </td>
        <td>
          <pre className="mb-0" style={{backgroundColor: "#d6d6d6"}}>
            {output_preview}
          </pre>
        </td>
        <td>{input_file}</td>
        <td>{output_file}</td>
        <td>{points}</td>
        <td>
          <input
            type="checkbox"
            value={is_pretest}
            onChange={() => onPretestToggle()}
          />
        </td>
        <td>
          <div className="row row-cols-5 border-0">
            <Link to="#" className="col" onClick={_e => onEditLinkClick()}>
              Edit
            </Link>
            <Link
              to="#"
              className="col"
              onClick={_e => alert("Not implemented.")}
            >
              Move
            </Link>
            <Link
              to="#"
              className="col"
              onClick={_e => alert("Not implemented.")}
            >
              Group
            </Link>
            <Link
              to="#"
              className="col"
              onClick={_e => alert("Not implemented.")}
            >
              Points
            </Link>
            <Link
              to="#"
              onClick={_e => alert("Not implemented.")}
              className="text-danger col"
            >
              Delete
            </Link>
          </div>
        </td>
        <td>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelectChkChange()}
          />
        </td>
      </tr>
    );
  }
}

export default class TestcaseDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loaded: false,
      errors: null,

      selectChk: [],
      submitting: false,
      editingTestId: null,
    };
  }

  selectChkChangeHandler(idx) {
    const {selectChk} = this.state;
    if (idx >= selectChk.length) console.log("Invalid delete tick position");
    else {
      const val = selectChk[idx];
      this.setState({
        selectChk: selectChk
          .slice(0, idx)
          .concat(!val, selectChk.slice(idx + 1)),
      });
    }
  }

  flipAllSelectChkHandler(isToggleAll) {
    const {selectChk} = this.state;
    this.setState({
      selectChk: selectChk.map(() => isToggleAll),
    });
  }

  deleteAllSelectedTestHandler() {
    const {selectChk} = this.state;
    const selectedCount = selectChk.filter(v => v).length;
    if (selectedCount == 0) return;

    if (window.confirm(`Xác nhận xóa ${selectedCount} testcases đã chọn?`)) {
      alert("Chưa code đâu ạ, hiu");
    }
  }

  setEditingTest(id) {
    this.setState({
      editingTestId: id,
    });
  }

  pretestToggleHandler(id) {
    const testcases = this.state.data;
    let sel = testcases.find(tc => tc.id === id);
    if (!sel) return;
    sel.is_pretest = !sel.is_pretest;

    this.setState({
      data: testcases.map(tc => (tc.id === id ? sel : tc)),
    });
  }

  refetch() {
    if (this.state.submitting) return;
    if (this.props.setErrors) {
      this.props.setErrors(null);
    }
    this.setState(
      {
        submitting: true,
        errors: null,
      },
      () => {
        const {shortname} = this.props;
        problemAPI
          .adminGetProblemDetailsTest({shortname})
          .then(res => {
            this.setState({
              data: res.data,
              selectChk: Array(res.data.length).fill(false),
              loaded: true,
              // errors: null,
              submitting: false,
            });
          })
          .catch(err => {
            this.setState({
              loaded: true,
              submitting: false,
              // errors: ['Cannot fetch testcases for this problem. Has it been deleted?']
            });
            if (this.props.setErrors) {
              this.props.setErrors({errors: err.response.data});
            }
          });
      }
    );
  }

  componentDidMount() {
    this.refetch();
  }

  formSubmitHandler(e) {
    e.preventDefault();
    this.props.forceRerender();
    alert("Editing this resource is not implemented.");
  }

  render() {
    const {data, loaded, editingTestId} = this.state;
    const {shortname} = this.props;
    const testcases = data;
    if (editingTestId) {
      return (
        <TestcaseEditor
          shortName={shortname}
          testId={editingTestId}
          onCancel={() => this.setEditingTest(null)}
        />
      );
    }

    return (
      <Form
        id="problem-testcase-form"
        onSubmit={e => this.formSubmitHandler(e)}
      >
        <Row className="options m-1 border">
          <Col>
            {this.state.submitting && (
              <span className="loading_3dot">Đang xử lý yêu cầu</span>
            )}
          </Col>
          <Button
            variant="dark"
            size="sm"
            className="btn-svg"
            onClick={() => this.refetch()}
          >
            <VscRefresh /> Refresh
          </Button>
        </Row>

        <Accordion defaultActiveKey="0">
          {/* General Settings */}
          <Accordion.Item eventKey="0" className="testcases">
            <Accordion.Header>Testcases</Accordion.Header>
            <Accordion.Body>
              <ErrorBox errors={this.state.errors} />
              <sub className="ml-2">
                Những testcase này được tự động tạo ra từ file nén Archive trong
                tab Test Data.
              </sub>
              <Table
                responsive
                hover
                size="sm"
                striped
                bordered
                className="rounded text-center"
              >
                <thead>
                  <tr>
                    <th style={{width: "4%"}}>#</th>
                    <th style={{width: "12%"}}>Input Preview</th>
                    <th style={{width: "12%"}}>Output Preview</th>
                    <th style={{width: "6%"}}>Input File</th>
                    <th style={{width: "10%"}}>Output File</th>
                    <th style={{width: "5%"}}>Trọng số</th>
                    <th style={{width: "5%"}}>Pretest?</th>
                    <th style={{width: "100%"}} className="d-flex flex-column">
                      <div>Action</div>
                      <div className="row row-cols-5 border-0">
                        <Link
                          to="#"
                          onClick={_e => alert("Not implemented.")}
                          className="col"
                        >
                          Copy
                        </Link>
                        <Link
                          to="#"
                          onClick={_e => alert("Not implemented.")}
                          className="col"
                        >
                          Move
                        </Link>
                        <Link
                          to="#"
                          onClick={_e => alert("Not implemented.")}
                          className="col"
                        >
                          Group
                        </Link>
                        <Link
                          to="#"
                          onClick={_e => alert("Not implemented.")}
                          className="col"
                        >
                          Points
                        </Link>
                        <Link
                          to="#"
                          onClick={() => this.deleteAllSelectedTestHandler()}
                          className="text-danger col"
                        >
                          Delete
                        </Link>
                      </div>
                    </th>
                    <th style={{width: "2%"}}>
                      <input
                        type="checkbox"
                        onChange={e =>
                          this.flipAllSelectChkHandler(e.target.checked)
                        }
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loaded === false ? (
                    <tr>
                      <td colSpan="6">
                        <SpinLoader margin="10px" />
                      </td>
                    </tr>
                  ) : (
                    testcases.map((tc, idx) => (
                      <TestcaseItem
                        key={`tc-${tc.id}`}
                        rowidx={idx}
                        {...tc}
                        onPretestToggle={() => this.pretestToggleHandler(tc.id)}
                        isSelected={this.state.selectChk[idx]}
                        onEditLinkClick={() => this.setEditingTest(tc.id)}
                        onSelectChkChange={() =>
                          this.selectChkChangeHandler(idx)
                        }
                      />
                    ))
                  )}
                </tbody>
              </Table>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <Row>
          <Col>
            <Button
              variant="dark"
              size="sm"
              type="submit"
              onClick={e => this.formSubmitHandler(e)}
            >
              No Op
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
