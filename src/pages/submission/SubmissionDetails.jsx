import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Table } from 'react-bootstrap';

import submissionAPI from 'api/submission';
import { SpinLoader } from 'components';
import { CodeEditor } from 'components/CodeEditor';

import { withParams } from 'helpers/react-router'
import { parseTime, parseMem } from 'helpers/textFormatter';
import { setTitle } from 'helpers/setTitle'

import { STOP_POLL_STATUSES, NO_DETAIL_STATUSES } from 'constants/statusFilter';

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
      loaded: false, errors: null,
      data: { 
        status: ".",
      }, 
    };
  }

  fetch() {
    submissionAPI.getSubmissionDetails({id : this.state.id})
      .then((res) => {
        setTitle(`Sub#${res.data.id}`)
        this.setState({ data: res.data, })
      })
      .catch((err) => {
        this.setState({ errors: err, })
        console.log('Error when Polling', err)
      })
      .finally(() => {
        this.setState({ loaded: true })
      })
  }
  pollResult() { 
    if (STOP_POLL_STATUSES.includes(this.state.data.status)) {
      clearInterval(this.timer)
      return;
    }
    this.fetch();
  }
  componentDidMount() {
    this.fetch();
    if (! STOP_POLL_STATUSES.includes(this.state.data.status))
      this.timer = setInterval(() => this.pollResult(), 2000);
  }
  componentWillUnmount() {
    clearInterval(this.timer)
  }

  render() {
    const { data, loaded } = this.state;
    let verdict = 'QU';
    if (loaded)
      verdict = (data.status === "D" ? data.result : data.status);
    const polling = (loaded && data.status !== 'D');

    return (
      <div className="submission-info">
        <h4 className="submission-title"> 
          { 
            !loaded ? 
            <span><SpinLoader/> Loading...</span> : 
            <span>
              {`Submission # ${data.id}`}
              {polling && <div className="loading_3dot"></div>}
            </span>
          }
        </h4>
        <hr/>
        <div className={`submission-details ${loaded && "text-left"}`}>
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
                      <span className={`verdict ${verdict.toLowerCase()}`}>
                        <span>{verdict}</span>
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
