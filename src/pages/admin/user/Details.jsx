import React from 'react';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { FaRegTrashAlt } from 'react-icons/fa';
import { VscRefresh } from 'react-icons/vsc';

import userAPI from 'api/user';
import { SpinLoader, ErrorBox } from 'components';
import { withParams } from 'helpers/react-router'
import { setTitle } from 'helpers/setTitle';

import './Details.scss';

class AdminJudgeDetails extends React.Component {
  constructor(props) {
    super(props);
    const { id } = this.props.params;
    this.id = id;
    this.state = {
      loaded: false, errors: null,
      data: undefined,
    };
  }

  fetch() {
    userAPI.getUser({id: this.id})
      .then((res) => {
        this.setState({
          data: res.data,
          loaded: true,
        })
        setTitle(`Admin | User. ${res.data.username}`)
      }).catch((err) => {
        this.setState({
          loaded: true,
          errors: err,
        })
      })
  }

  componentDidMount() {
    setTitle(`Admin | User#${this.id}`)
    this.fetch()
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

  deleteObjectHandler() {
    let conf = window.confirm("Hãy hủy kích hoạt (De-activate) User này thay vì xóa. "+
      "Nếu xóa, mọi tài nguyên liên quan sẽ bị ảnh hưởng. Bạn có chắc không?");
    if (conf) {
      userAPI.adminDeleteUser({id: this.id})
        .then((res) => {
          toast.success("OK Deleted.");
          this.setState({ redirectUrl : '/admin/user/' })
        })
        .catch((err) => {
          toast.error(`Cannot delete. (${err})`);
        })
    }
  }

  getTime(key) {
    if (this.state.data && this.state.data[key]) {
      let time = new Date(this.state.data[key])
      time.setMinutes(time.getMinutes() - time.getTimezoneOffset());
      return time.toISOString().slice(0, 16);
    }
    return '';
  }
  setTime(key, v) {
    let time = new Date(v)
    const data = this.state.data;
    this.setState({ data : { ...data, [key]: time.toISOString() } });
  }

  formSubmitHandler(e) {
    e.preventDefault();
    let sendData = this.state.data;
    delete sendData.url;
    delete sendData.id;
    userAPI.adminEditUser({id: this.id, data: sendData})
    .then((res) => {
      toast.success('OK Saved.')
      this.fetch();
    })
    .catch((err) => {
      const data = err.response.data;
      toast.error('Cannot save.')
      this.setState({errbox_errors: data})
    })
  }

  render() {
    if (this.state.redirectUrl) 
      return ( <Navigate to={`${this.state.redirectUrl}`} /> )
    
    const {loaded, errors, data} = this.state;

    return (
      <div className="admin user-panel">
        <h4 className="user-title">
          { !loaded && <span><SpinLoader/> Loading...</span>}
          { loaded && !!errors && <span>Something went wrong.</span>}
          { loaded && !errors && <div className="panel-header">
              <span className="title-text">{`Viewing user. ${data.username}`}</span>
              <span>
                <Button className="btn-svg" size="sm" variant="danger"
                  onClick={()=>this.deleteObjectHandler()}>
                    <FaRegTrashAlt/><span className="d-none d-md-inline">Delete</span>
                </Button>
              </span>
            </div>
          }
        </h4>
        <hr/>
        <div className="user-details">
          { !loaded && <span><SpinLoader/> Loading...</span> }

          { loaded && !errors && <>
            <ErrorBox errors={this.state.errbox_errors} />
            <Form id="user-general" onSubmit={(e) => this.formSubmitHandler(e)}>
              <Row>
                <Form.Label column="sm" > ID </Form.Label>
                <Col> <Form.Control size="sm" type="text" placeholder="User ID" id="id"
                        value={data.id || ''} disabled readOnly
                /></Col>
                <Form.Label column="sm" md={3} > Username </Form.Label>
                <Col> <Form.Control size="sm" type="text" placeholder="Username" id="username"
                        value={data.username || ''} disabled readOnly
                /></Col>
                <Form.Label column="sm" md={3} > Password </Form.Label>
                <Col>
                  <Button size="sm" variant="warning" className="btn-svg"
                    onClick={(e)=>{}}
                  ><VscRefresh/><span>Re-generate</span></Button> 
                </Col>
              </Row>

              <Row>
                <Form.Label column="sm" > Active </Form.Label>
                <Col > <Form.Control size="sm" type="checkbox" id="is_active"
                        checked={data.is_active || false}
                        onChange={(e)=>this.inputChangeHandler(e, {isCheckbox: true})}
                /></Col>
                <Form.Label column="sm" > Staff Status </Form.Label>
                <Col > <Form.Control size="sm" type="checkbox" id="is_staff"
                        checked={data.is_staff || false}
                        onChange={(e)=>this.inputChangeHandler(e, {isCheckbox: true})}
                /></Col>
                <Form.Label column="sm" > Superuser Status </Form.Label>
                <Col > <Form.Control size="sm" type="checkbox" id="is_superuser"
                        checked={data.is_superuser || false}
                        onChange={(e)=>this.inputChangeHandler(e, {isCheckbox: true})}
                /></Col>
              </Row>

              <Row>
                <Form.Label column="sm" md={2}> Date Joined </Form.Label>
                <Col> <Form.Control size="sm" type="datetime-local" id="date_joined"
                        value={this.getTime('date_joined')} 
                        onChange={(e)=>this.setTime('date_joined', e.target.value)}
                /></Col>
              </Row>
              <Row>
                <Form.Label column="sm" md={2}> Last Login </Form.Label>
                <Col> <Form.Control size="sm" type="datetime-local" id="last_login"
                        value={this.getTime('last_login')} 
                        onChange={(e)=>this.setTime('last_login', e.target.value)}
                /></Col>
              </Row>


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
          </>
          }
        </div>
      </div>
    )
  }
}

let wrappedPD = AdminJudgeDetails;
wrappedPD = withParams(wrappedPD);
const mapStateToProps = state => {
    return { user : state.user.user }
}
wrappedPD = connect(mapStateToProps, null)(wrappedPD);
export default wrappedPD;
