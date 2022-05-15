import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Table } from 'react-bootstrap';

import submissionAPI from 'api/submission';
import { SpinLoader } from 'components';
import { CodeEditor } from 'components/CodeEditor';

import { withParams } from 'helpers/react-router'
import { parseTime, parseMem } from 'helpers/textFormatter';

import './SubmissionDetails.scss';

class SubmissionTestCase extends React.Component {
  render() {
    const data = this.props.data;
    return (
      <tr className="test-case-result">
        <td>
          <strong>Case#{data.case}</strong>
        </td>
        <td>
          <span className={`verdict ${data.status.toLowerCase()}`}>
            <span>{data.status}</span>
          </span>
        </td>
        <td>
          <span className="time">{parseTime(data.time)}</span>
        </td>
        <td>
          <span className="time">{parseMem(data.memory)}</span>
        </td>
      </tr>
    )
  }
}

class SubmissionDetails extends React.Component {
  constructor(props) {
    super(props);
    const { id } = this.props.params;
    this.state = { 
      id: id,
      data: undefined, loaded: false, errors: null,
    };
  }

  componentDidMount() {
    submissionAPI.getSubmissionDetails({id: this.state.id})
      .then((res) => {
        this.setState({
          data: res.data,
          loaded: true,
        })
      })
      .catch((err) => {
        this.setState({
          loaded: true,
          errors: err,
        })
      })
  }

  render() {
    const { data } = this.state;
    return (
      <div className="submission-info">
        <h4 className="submission-title"> 
          { !this.state.loaded ? <span><SpinLoader/> Loading...</span> : `Submission # ${data.id}` }
        </h4>
        <hr/>
        <div className="submission-details">
          { 
            !this.state.loaded ? <span><SpinLoader/> Loading...</span> 
            : <>
              <div className="general info-subsection">
                <h5>General</h5>
                <Row>
                  <Col >
                    <span><strong>Language:</strong>{ data.language }</span>
                  </Col>
                  <Col >
                    <span><strong>Problem:</strong>
                      <Link to={`/problem/${data.problem.shortname}`}>
                        { data.problem.title }
                      </Link> 
                    </span>
                  </Col>
                  <Col >
                    <span><strong>Author:</strong>
                      <Link to={`/user/${data.user.owner.username}`}>
                        { data.user.owner.username }
                      </Link> 
                    </span>
                  </Col>
                  <Col >
                    <span><strong>Result:</strong>
                      <span className={`verdict ${data.result.toLowerCase()}`}>
                        <span>{data.result}</span>
                      </span>
                    </span>
                  </Col>
                </Row>
              </div>
              <div className="source info-subsection">
                <h5>Source</h5>
                <Row><Col>
                  <CodeEditor 
                    code={data.source}
                    onCodeChange={() => {}}
                    ace={data.language_ace}
                    readOnly={true}
                  />
                </Col></Row>
              </div>
              <div className="test-result info-subsection">
                <h5>Test Result</h5>
                <Row><Col>
                <Table responsive size="xs" striped>
                  <tbody>
                  {
                    data.test_cases.map(
                      (test_case) => <SubmissionTestCase 
                        key={test_case.id} data={test_case}
                      />
                    )
                  }
                  </tbody>
                </Table>
                </Col></Row>
              </div>
            </>
          }
        </div>
      </div>
    )
  }
}

export default withParams(SubmissionDetails);
