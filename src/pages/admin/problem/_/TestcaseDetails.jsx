import React from 'react';
import { toast } from 'react-toastify';
import { Link, Navigate } from 'react-router-dom';
import { Form, Accordion, Button, Table, Row, Col } from 'react-bootstrap';
import { ErrorBox, SpinLoader } from 'components'

import problemAPI from 'api/problem';

class ButtonPanel extends React.Component {
  render() {
    return (
      <Row className="button-panel">
        <Col >
          <Button variant="dark" size="sm" type="submit" className="m-1">
            Save
          </Button>
        </Col>
      </Row>
    )
  }
}

class TestcaseItem extends React.Component {
  render() {
    const {
      rowidx, 
      id, order, input_file, output_file, points, is_pretest,
      onPretestToggle, 
      isSelected, onSelectChkChange
    } = this.props;

    return (
      <tr>
        <td>{order}</td>
        <td>{input_file}</td>
        <td>{output_file}</td>
        <td>{points}</td>
        <td>
          <input type="checkbox" value={is_pretest}
            onChange={() => onPretestToggle()}
          />
        </td>
        <td>
          <input type="checkbox"
            value={isSelected}
            onChange={() => onSelectChkChange()}
          />
        </td>
      </tr>
    )
  }
}

export default class TestcaseDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shortname: this.props.shortname,
      data: [],
      loaded: false,
      errors: null,

      selectChk: [],
    }
  }

  selectChkChangeHandler(idx) {
    const { selectChk } = this.state;
    if (idx >= selectChk.length)
      console.log('Invalid delete tick position');
    else {
      const val = selectChk[idx];
      this.setState({
        selectChk: selectChk.slice(0, idx).concat(!val, selectChk.slice(idx+1))
      })
    }
  }
  
  pretestToggleHandler(id) {
    const testcases = this.state.data;
    let sel = testcases.find(tc => tc.id === id)
    if (!sel) return;
    sel.is_pretest = !sel.is_pretest

    this.setState({
      data: testcases.map( tc => ((tc.id === id) ? sel : tc) )
    })
  }

  componentDidMount() {
    const {shortname} = this.state;
    problemAPI.adminGetProblemDetailsTest({shortname})
      .then((res) => {
        this.setState({ 
          data: res.data,
          selectChk: Array(res.data.length).fill(false),
          loaded: true,
          errors: null,
        })
      }).catch((err) => {
        this.setState({ 
          loaded: true,
          errors: ['Cannot fetch testcases for this problem. Has it been deleted?']
        })
      })
  }

  render() {
    const {data, loaded} = this.state;
    const testcases = data;

    return (
      <Form id="problem-testcase-form">
        <Accordion defaultActiveKey="0">
          {/* General Settings */}
          <Accordion.Item eventKey="0" className="testcases">
            <Accordion.Header>Testcases</Accordion.Header>
            <Accordion.Body>
              <ErrorBox errors={this.state.errors} />
              <sub>Những testcase này được tự động tạo ra từ file nén Archive trong tab Test Data.</sub>
              <Table responsive hover size="sm" striped bordered className="rounded text-center">
                <thead>
                  <tr>
                    <th style={{width: "5%"}}>#</th>
                    <th style={{width: "12%"}}>Input File</th>
                    <th style={{width: "10%"}}>Output File</th>
                    <th style={{width: "13%"}}>Trọng số</th>
                    <th style={{width: "10%"}}>Pretest?</th>
                    <th style={{width: "8%"}}>
                      <Link to="#" onClick={(e) => alert('Not implemented.')}>Action</Link>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {
                    loaded === false
                      ? <tr><td colSpan="6"><SpinLoader margin="10px" /></td></tr>
                      : testcases.map((tc, idx) => <TestcaseItem
                          key={`tc-${tc.id}`}
                          rowidx={idx} {...tc}
                          onPretestToggle={() => this.pretestToggleHandler(tc.id)}
                          isSelected={this.state.selectChk[idx]}
                          onSelectChkChange={() => this.selectChkChangeHandler(idx)}
                        />)
                  }
                </tbody>
              </Table>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <ButtonPanel />
      </Form>
    )
  }
}
