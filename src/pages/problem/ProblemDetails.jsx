import React from 'react';
import { Link } from 'react-router-dom';
import {Row, Col } from 'react-bootstrap';

import problemAPI from 'api/problem';
import { SpinLoader } from 'components';
import { withParams } from 'helpers/react-router'
import { setTitle } from 'helpers/setTitle';

import { FaPaperPlane } from 'react-icons/fa';

import PDFViewer from 'components/PDFViewer/PDFViewer';
import { SubmitModal } from 'pages/submit';

import './ProblemDetails.scss';
class ProblemDetails extends React.Component {
  constructor(props) {
    super(props);
    const { shortname } = this.props.params;
    this.shortname = shortname;
    this.state = { 
      data: undefined, loaded: false, errors: null, shortname: shortname,

      submitFormShow: false,
    };
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
        setTitle(`Prob. ${res.data.title}`)
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


    return (
      <div className="problem-info">
        <h4 className="problem-title"> 
          { !this.state.loaded ? <span><SpinLoader/> Loading...</span> : `Problem. ${this.state.data.title}` }
        </h4>
        <hr/>
          <div className="problem-details">
            { 
            !this.state.loaded ? <span><SpinLoader/> Loading...</span> 
            : <>
              <Row style={{margin: "unset"}}>
                <Col sm={9}>
                  <ul>
                    <li>
                      <strong>Problem Code:</strong>
                      { this.state.data.shortname }
                    </li>
                    <li>
                      <strong>Time Limit per test:</strong>
                      { this.parseTimeLimit() }
                    </li>
                    <li>
                      <strong>Memory Limit per test:</strong>
                      { this.parseMemoryLimit() }
                    </li>
                  </ul>
                </Col>
                <Col sm={3} className="options">
                  <Link to="#" className="btn" 
                    onClick={() => this.handleSubmitFormOpen()}>
                    Submit <FaPaperPlane/>
                  </Link>

                  <SubmitModal show={this.state.submitFormShow} 
                    onHide={() => this.handleSubmitFormClose()}
                    prob={this.state.data.shortname}
                    lang={this.state.data.allowed_languages}
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
                <PDFViewer pdf={this.state.data.pdf} />
              </div>
            </>
          }
        </div>
      </div>
    )
  }
}

export default withParams(ProblemDetails);
