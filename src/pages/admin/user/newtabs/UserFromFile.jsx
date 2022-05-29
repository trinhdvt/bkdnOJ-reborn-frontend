import React from 'react';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { Form, Row, Col, Button, Accordion } from 'react-bootstrap';
import { VscSave } from 'react-icons/vsc';

import userAPI from 'api/user';
import { FileUploader, ErrorBox } from 'components';

const saveFile = async (blob) => {
  const a = document.createElement('a');
  a.download = 'users.csv';
  a.href = URL.createObjectURL(blob);
  a.addEventListener('click', (e) => {
    setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
  });
  a.click();
};

export default class UserFromFile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      file : null,
    }
  }

  setFile(file) { this.setState({ file })}

  sendFile(e) {
    e.preventDefault();
    if (!this.state.file) {
      alert('Hãy chọn một file .CSV trước khi Submit');
      return;
    }
    let formData = new FormData();
    formData.append("file", this.state.file);
    this.setState({submitting: true},
      async () => userAPI.adminGenUserFromCSV({formData})
        .then((res) => {
          toast.success("OK Created");
          const blob = new Blob([res.data], {type : 'application/csv'});
          saveFile(blob);
          this.props.redirectTo('/admin/user');
        })
        .catch((err) => {
          toast.error(`Cannot create. (${err})`);
          if (err.response)
            this.setState({ errors : err.response.data })
        })
        .finally(() => {
          this.setState({submitting: false})
        })
    )
  }

  render() {
    return (
        <>
        <ErrorBox errors={this.state.errors}></ErrorBox>
        <Accordion defaultActiveKey="1">
          <Accordion.Item eventKey="0" className="help">
            <Accordion.Header>Hướng dẫn file CSV</Accordion.Header>
            <Accordion.Body>
              <Row><Col>
                  <div className="border p-1" >
                    <p>Xét file csv sau:</p>
                    <pre>{`username,email,password\nuser1,user1@mail.com,Jy51ns93@!f\nuser2,user2@mail.com,J8v#zav%p\n`}</pre>
                    <p>Sẽ tạo ra tài khoản <code>user1</code> và <code>user2</code> với mail và mật khẩu tương ứng</p>
                    <p>Ngoài ra, bạn có thể bỏ qua cột <code>password</code> và hệ thống sẽ tự sinh mật khẩu giúp bạn.
                      Sau khi xử lý xong yêu cầu, hệ thống gửi trả một file csv ghi lại tất cả tài khoản được tạo kèm theo mật khẩu.
                    </p><p>File này sẽ không được hệ thống lưu trữ vì lý do bảo mật.</p>
                  </div>
              </Col></Row>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        <div className="border m-1" >
        <Row style={{overflow: "auto"}}>
          <Col className="m-1">
              <FileUploader
                onFileSelectSuccess={(file) => this.setFile(file)}
                onFileSelectError={({ error }) => alert(error)}
              />
          </Col>
          <Col sm={2} className="m-1">
              <Button variant="dark" size="sm" className="btn-svg" disabled={this.state.submitting}
                onClick={(e) => this.sendFile(e)}><VscSave/> Submit</Button>
          </Col>
        </Row>
        </div>
      </>
    )
  }
}