import React from 'react';
import { connect } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { Row, Col, Table } from 'react-bootstrap';
import { FaWrench } from 'react-icons/fa';
import { VscError } from 'react-icons/vsc';

import submissionAPI from 'api/submission';
import { SpinLoader } from 'components';
import { CodeEditor } from 'components/CodeEditor';

import { withParams } from 'helpers/react-router'
import { parseTime, parseMem } from 'helpers/textFormatter';
import { setTitle } from 'helpers/setTitle'

import { getPollDelay } from 'helpers/polling';
import { shouldStopPolling } from 'constants/statusFilter';

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
    this.user = (this.props.user) || null;
  }

  fetch() {
    submissionAPI.getSubmissionDetails({id : this.state.id})
      .then((res) => {
        setTitle(`Submission#${res.data.id}`)
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
    if (shouldStopPolling(this.state.data.status) || !!this.state.errors) {
      console.log('Clear?')
      clearInterval(this.timer)
      return;
    }
    this.fetch();
  }

  componentDidMount() {
    this.fetch();
    if (! shouldStopPolling(this.state.data.status))
      this.timer = setInterval(() => this.pollResult(), getPollDelay());
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  render() {
    if (this.state.redirectUrl) {
      return <Navigate to={`${this.state.redirectUrl}`} />
    }

    const { data, loaded, errors, contest } = this.state;

    const isLoggedIn = !!this.user;
    const isInContest = !!contest;
    const isSuperuser = isLoggedIn && this.user.is_superuser;

    let verdict = 'QU';
    if (loaded && !errors)
      verdict = (data.status === "D" ? data.result : data.status);
    const polling = (loaded && !errors && !shouldStopPolling(data.status));

    return (
      <div className="submission-info wrapper-vanilla">
        <h4 className="submission-title">
            { !loaded && <span><SpinLoader/> Loading...</span> }
            { loaded && !!errors && <span>Submission Not Available</span>}
            { loaded && !errors &&
              <span>
                {`Submission#${data.id}`}
                {polling && <div className="loading_3dot"></div>}
              </span>
            }
        </h4>
        <hr/>
        <div className={`submission-details ${loaded && "text-left"}`}>
          {
            !loaded && <span><SpinLoader/> Loading...</span>
          }{
            loaded && errors && <>
              <div className="flex-center-col" style={{ "height": "100px" }}>
                <VscError size={30} color="red"/>
              </div>
            </>
          }{
            loaded && !errors && <>
              <div className="general info-subsection">
                {
                  (!!this.user && this.user.is_staff) &&
                  <div>
                    <h5>Admin Panel</h5>
                    <Row>
                    <Col >
                      <Link to="#" className="btn" style={{color: "red"}}
                        onClick={() => this.setState({redirectUrl: `/admin/submission/${this.state.id}`})}>
                        Admin <FaWrench size={12}/>
                      </Link>
                    </Col>
                    </Row>
                  </div>
                }
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

let wrapped = SubmissionDetails;
wrapped = withParams(wrapped);
const mapStateToProps = state => {
    return { user : state.user.user }
}
wrapped = connect(mapStateToProps, null)(wrapped);
export default wrapped;
