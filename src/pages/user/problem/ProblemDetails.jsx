import React from 'react';
import { connect } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';

import PDFViewer from 'components/PDFViewer/PDFViewer';
import { FaPaperPlane, FaSignInAlt, FaExternalLinkAlt, FaWrench } from 'react-icons/fa';

import problemAPI from 'api/problem';
import { SpinLoader } from 'components';
import { withParams } from 'helpers/react-router'
import { setTitle } from 'helpers/setTitle';

import { SubmitModal } from 'pages/user/submit';
// import { getAdminPageUrl } from 'api/urls';

import './ProblemDetails.scss';

class ProblemDetails extends React.Component {
  constructor(props) {
    super(props);
    const { shortname } = this.props.params;
    this.shortname = shortname;
    this.state = {
      data: undefined, loaded: false, errors: null, shortname: shortname,
      redirectUrl: null,
      submitFormShow: false,
    };
    this.user = (this.props.user.user);
  }

  handleSubmitFormOpen() { this.setState({ submitFormShow: true })}
  handleSubmitFormClose() { this.setState({ submitFormShow: false })}

  onDocumentLoadSuccess({ numPages }) {
    this.setState({ numPages })
  }

  componentDidMount() {
    problemAPI.getProblemDetails({shortname: this.shortname})
      .then((res) => {
        this.setState({
          data: res.data,
          loaded: true,
        })
        setTitle(`Problem. ${res.data.title}`)
      })
      .catch((err) => {
        this.setState({
          loaded: true,
          errors: err,
        })
      })
  }

  parseMemoryLimit() {
    return `${(this.state.data.memory_limit)} KB(s)`
  }
  parseTimeLimit() {
    return `${(this.state.data.time_limit).toFixed(1)} second(s)`
  }

  render() {
    if (this.state.redirectUrl) {
      return <Navigate to={`${this.state.redirectUrl}`} />
    }
    const {loaded, errors, data} = this.state;

    return (
      <div className="problem-info">
        <h4 className="problem-title">
          { !loaded && <span><SpinLoader/> Loading...</span>}
          { loaded && !!errors && <span>Problem Not Found</span>}
          { loaded && !errors && `Problem. ${data.title}` }
        </h4>
        <hr/>
          <div className="problem-details">
          { !loaded && <span><SpinLoader/> Loading...</span> }
          { loaded && !errors && <>
              <Row style={{margin: "unset"}}>
                <Col sm={9}>
                  <ul>
                    <li>
                      <strong>Problem Code:</strong>
                      { data.shortname }
                    </li>
                    <li>
                      <strong>Time Limit per test:</strong>
                      { this.parseTimeLimit() }
                    </li>
                    <li>
                      <strong>Memory Limit per test:</strong>
                      { this.parseMemoryLimit() }
                    </li>
                    <li>
                      <strong>Allowed Languages:</strong>
                        {
                          data.allowed_languages.map((lang) => lang.name).join(', ')
                        }
                    </li>
                  </ul>
                </Col>
                <Col sm={3} className="options">
                  {
                    this.user === null && (
                    <Link to="#" className="btn"
                      onClick={() => this.setState({redirectUrl: '/sign-in'})}>
                      Sign In To Submit <FaSignInAlt size={12}/>
                    </Link>)
                  }{
                    this.user !== null && (<Link to="#" className="btn"
                      onClick={() => this.handleSubmitFormOpen()}>
                      Submit <FaPaperPlane size={12}/>
                    </Link>)
                  }{
                    (this.user !== null && this.user.is_staff) && (
                      <Link to="#" className="btn" style={{color: "red"}}
                        onClick={() => this.setState({redirectUrl: `/admin/problem/${data.shortname}`})}>
                        Admin <FaWrench size={12}/>
                      </Link>
                    )
                  }

                  <SubmitModal show={this.state.submitFormShow}
                    onHide={() => this.handleSubmitFormClose()}
                    prob={data.shortname}
                    lang={data.allowed_languages}
                  />

                  {/* <Link to="/submit" className="btn">Test</Link> */}
                </Col>
              </Row>
              <div className="problem-pdf shadow">
                {/* <object data={`${this.state.data.pdf}`} type="application/pdf">
                  <iframe title="problem-pdf-iframe"
                    src={`https://docs.google.com/viewer?url=${this.state.data.pdf}&embedded=true`}>
                  </iframe>
                </object> */}
                <PDFViewer pdf={data.pdf} />
              </div>
            </>
          }
        </div>
      </div>
    )
  }
}

let wrappedPD = ProblemDetails;
wrappedPD = withParams(wrappedPD);
const mapStateToProps = state => {
    return { user : state.user.user }
}
wrappedPD = connect(mapStateToProps, null)(wrappedPD);
export default wrappedPD;
