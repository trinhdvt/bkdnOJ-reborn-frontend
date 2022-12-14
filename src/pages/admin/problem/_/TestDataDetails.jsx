import React from "react";
import {toast} from "react-toastify";

import {Accordion, Button, Form, Row, Col} from "react-bootstrap";
import {ErrorBox, SpinLoader, FileUploader} from "components";

import {FaRegSave} from "react-icons/fa";
import {VscRefresh} from "react-icons/vsc";

import problemAPI from "api/problem";

export default class TestDataDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        zipfile: null,
        custom_checker: null,
        custom_checker_remove: false,
        zipfile_remove: false,
        generator_remove: false,
      },
      selectedZip: null,
      selectedCustomChecker: null,
      submitting: false,
    };
  }
  refetch() {
    if (this.state.submitting) return;
    this.setState(
      {
        submitting: true,
        errors: null,
      },
      () => {
        const {shortname} = this.props;
        problemAPI
          .adminGetProblemDetailsData({shortname})
          .then(res => {
            this.setState({
              data: {
                ...res.data,
                zipfile_remove: false,
                generator_remove: false,
              },
              submitting: false,
            });
          })
          .catch(err => {
            this.setState({submitting: false});
            console.log(err);
          });
      }
    );
  }

  componentDidMount() {
    this.refetch();
  }

  setSelectedZip(file) {
    this.setState({selectedZip: file});
  }
  setSelectedCustomChecker(file) {
    this.setState({selectedCustomChecker: file});
  }

  inputChangeHandler(event, params = {isCheckbox: null}) {
    const isCheckbox = params.isCheckbox || false;

    let newData = this.state.data;
    if (!isCheckbox) newData[event.target.id] = event.target.value;
    else {
      newData[event.target.id] = !newData[event.target.id];
    }
    this.setState({data: newData});
  }

  formSubmitHandler(e) {
    e.preventDefault();
    if (this.state.submitting) return;
    if (this.props.setErrors) {
      this.props.setErrors(null);
    }

    let {
      // eslint-disable-next-line no-unused-vars
      zipfile,
      ...sendData
    } = this.state.data;
    let formData = new FormData();

    if (this.state.selectedZip)
      formData.append("zipfile", this.state.selectedZip);
    if (this.state.selectedCustomChecker)
      formData.append("custom_checker", this.state.selectedCustomChecker);

    for (let key in sendData) {
      if (![null, undefined].includes(sendData[key]))
        formData.append(key, sendData[key]);
    }

    this.setState({submitting: true}, () => {
      problemAPI
        .adminEditProblemDataForm({
          shortname: this.props.shortname,
          formData,
        })
        .then(() => {
          toast.success("OK Updated.");
          this.props.forceRerender();
        })
        .catch(err => {
          this.setState({
            errors: {
              errors: err.response.data || ["Cannot update problem data."],
            },
            submitting: false,
          });
        });
    });
  }

  render() {
    const {data} = this.state;
    return (
      <Form id="problem-general" onSubmit={e => this.formSubmitHandler(e)}>
        <Row className="options m-1 border">
          <Col>
            {this.state.submitting && (
              <span className="loading_3dot">??ang x??? l?? y??u c???u</span>
            )}
          </Col>
          <Button
            variant="dark"
            size="sm"
            className="btn-svg"
            disabled={this.state.submitting}
            onClick={() => this.refetch()}
          >
            <VscRefresh /> Refresh
          </Button>
        </Row>
        <ErrorBox errors={this.state.errors} />
        <Row>
          <Form.Label column="sm" md={2}>
            {" "}
            Archive{" "}
          </Form.Label>
          <Col md={10}>
            <div className="p-0">
              {data.zipfile ? (
                <a href={data.zipfile} className="text-truncate">
                  {data.zipfile}
                </a>
              ) : (
                "Not Available"
              )}
              <FileUploader
                onFileSelectSuccess={file => this.setSelectedZip(file)}
                onFileSelectError={({error}) => alert(error)}
              />
            </div>
          </Col>

          <Form.Label column="sm" xs={3}>
            {" "}
            Remove Archive?{" "}
          </Form.Label>
          <Col xs={9}>
            <Form.Control
              size="sm"
              type="checkbox"
              id="zipfile_remove"
              checked={data.zipfile_remove}
              onChange={e => this.inputChangeHandler(e, {isCheckbox: true})}
            />
          </Col>
        </Row>
        <Row>
          <Form.Label column="sm" lg={2}>
            {" "}
            Checker{" "}
          </Form.Label>
          <Col lg={10}>
            <Form.Select
              aria-label={data.checker}
              size="sm"
              value={data.checker}
              id="checker"
              onChange={e => this.inputChangeHandler(e)}
              className="mb-1 w-100"
            >
              <option value="standard">Standard</option>
              <option value="floats">Floats</option>
              <option value="floatsabs">Floats (Absolute)</option>
              <option value="floatsrel">Floats (Relative)</option>
              <option value="rstripped">Non-trailing spaces</option>
              <option value="sorted">Unordered</option>
              <option value="identical">Byte identical</option>
              <option value="linecount">Line-by-line</option>
              <option value="custom-PY3">Custom checker (Py3)</option>
              <option value="custom-CPP17">Custom checker (C++17)</option>
              <option value="interactive-CPP17">
                Interactive checker (C++17)
              </option>
            </Form.Select>
          </Col>

          <Form.Label column="sm" lg={2}>
            {" "}
            Custom Checker{" "}
          </Form.Label>
          <Col lg={10}>
            <div className="p-0">
              {data.custom_checker ? (
                <a href={data.custom_checker} className="text-truncate">
                  {data.custom_checker}
                </a>
              ) : (
                "None"
              )}
              <FileUploader
                onFileSelectSuccess={file =>
                  this.setSelectedCustomChecker(file)
                }
                onFileSelectError={({error}) => alert(error)}
              />
            </div>
          </Col>

          <Form.Label column="sm" sm={3}>
            {" "}
            Remove Custom Checker?{" "}
          </Form.Label>
          <Col sm={9}>
            <Form.Control
              size="sm"
              type="checkbox"
              id="custom_checker_remove"
              checked={data.custom_checker_remove}
              onChange={e => this.inputChangeHandler(e, {isCheckbox: true})}
            />
          </Col>

          <Form.Label column="sm" xl={12}>
            {" "}
            Checker Extra Arguments (JSON){" "}
          </Form.Label>
          <Col xl={12}>
            <Form.Control
              size="sm"
              as="textarea"
              placeholder={`{"precision": 6}`}
              id="checker_args"
              value={data.checker_args || ""}
              onChange={e => this.inputChangeHandler(e)}
              className="mb-1"
            />
          </Col>
          <Col xl={12}>
            <sub>
              Tham s??? th??m cho checker (<code>checker_args</code>)
            </sub>
          </Col>
        </Row>

        <Row>
          <Col lg={10}>
            <sub></sub>
          </Col>
          <Col className="justify-content-end">
            <Button
              variant="dark"
              size="sm"
              type="submit"
              className="btn-svg "
              disabled={this.state.submitting}
            >
              <FaRegSave /> Save
            </Button>
            {this.state.submitting && (
              <SpinLoader size={20} margin="auto 0 auto 15px" />
            )}
          </Col>
        </Row>
        <Row className="help-text checker-help">
          <Col xl={12} className="m-0 p-0">
            <strong>Checker Help</strong>
          </Col>
          <Col xl={12} className="m-0 p-0">
            <Accordion defaultActiveKey="-1">
              <Accordion.Item eventKey="0" className="checker-standard-help">
                <Accordion.Header>Checker: Standard</Accordion.Header>
                <Accordion.Body className="p-1">
                  <p>L?? checker m???c ?????nh khi t???o ra Problem.</p>
                  <p>
                    Checker n??y s??? so s??nh output submission v?? output c???a judge
                    theo t???ng token, hay word. C??? th???, m???t token hay word l?? m???t
                    x??u con n???m gi???a hai k?? t??? tr???ng (space, tab, newline,...).
                    Output s??? ???????c c???t th??nh m???t m???ng c??c token. B??i n???p ????ng
                    khi hai output t???o ra hai m???ng token gi???ng nhau.
                  </p>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="1" className="checker-floats-help">
                <Accordion.Header>Checker: Floats</Accordion.Header>
                <Accordion.Body className="p-1">
                  <p>
                    S??? d???ng checker <code>floats</code> n???u output b??? ???nh h?????ng
                    b???i sai s??? s??? th???c.
                  </p>
                  <p>
                    T???t c??? output kh??ng ph???i s??? s??? ???????c xem nh?? string v?? s??? so
                    s??nh b???ng. ?????i v???i output s???, ch??ng s??? ???????c so s??nh s??? th???c
                    d???a v??o gi?? tr??? c???a <code>args</code>.
                  </p>
                  <p>
                    C??? th???, <code>args</code> nh???n c??c kh??a sau:
                  </p>
                  <ul>
                    <li>
                      <code>precision</code>: M???t s??? nguy??n, m?? t??? epsilon. M???c
                      ?????nh: <code>6</code>.
                    </li>
                    <li>
                      <code>error_mode</code>: M???t x??u k?? t???, m?? t??? ch??? ????? sai
                      s???. M???c ?????nh, output s??? ???????c check theo c??? hai absolute v??
                      relative, ????ng 1 ho???c 2 ???????c xem nh?? ????ng. N???u mang gi??
                      tr??? <code>absolute</code>, check absolute error. N???u mang
                      gi?? tr??? <code>relative</code>, check relative error.
                    </li>
                  </ul>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="2" className="checker-floatsabs-help">
                <Accordion.Header>Checker: Floats (Absolute)</Accordion.Header>
                <Accordion.Body className="p-1">
                  <p>
                    L?? shortcut cho checker <code>floats</code> v???i{" "}
                    <code>error_mode</code> l?? <code>absolute</code>
                  </p>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="3" className="checker-floatsrel-help">
                <Accordion.Header>Checker: Floats (Relative)</Accordion.Header>
                <Accordion.Body className="p-1">
                  <p>
                    L?? shortcut cho checker <code>floats</code> v???i{" "}
                    <code>error_mode</code> l?? <code>relative</code>
                  </p>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item
                eventKey="4"
                className="checker-non-trailing-spaces-help"
              >
                <Accordion.Header>
                  Checker: Non-trailling spaces
                </Accordion.Header>
                <Accordion.Body className="p-1">
                  <p>
                    Output s??? ???????c so theo t???ng d??ng. M???i d??ng s??? ???????c x??a t???t
                    c??? k?? t??? tr???ng ph??a b??n ph???i tr?????c, sau ???? ???????c so s??nh
                    b???ng. S??? l?????ng d??ng ph???i b???ng nhau.
                  </p>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="5" className="checker-unordered-help">
                <Accordion.Header>Checker: Unordered</Accordion.Header>
                <Accordion.Body className="p-1">
                  <p>
                    Nh?? checker <code>standard</code>, nh??ng tr?????c khi so s??nh,
                    m???ng token s??? ???????c sort l???i.
                  </p>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="6" className="checker-identical-help">
                <Accordion.Header>Checker: Byte identical</Accordion.Header>
                <Accordion.Body className="p-1">
                  <p>Hai output s??? ???????c so kh???p t???ng byte m???t.</p>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item
                eventKey="7"
                className="checker-line-by-line-help"
              >
                <Accordion.Header>Checker: Line-by-line</Accordion.Header>
                <Accordion.Body className="p-1">
                  <p>
                    <code>linecount</code> checker so kh???p t???ng d??ng hai output.{" "}
                    <code>args</code> nh???n m???t kh??a
                    <code>feedback</code> m???c ?????nh l?? <code>true</code>, ngh??a
                    l?? y??u c???u m??y ch???m ph???n h???i feedback ????ng/sai cho t???ng
                    d??ng.
                  </p>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="8" className="custom-checker-py3-help">
                <Accordion.Header>Custom Checker: Py3</Accordion.Header>
                <Accordion.Body className="p-1">
                  <p>
                    <code>custom-checker</code>
                    s??? d???ng cho nh???ng b??i c?? nhi???u ????p ??n, c???n ph???i c?? m???t c??ch
                    ????? ki???m tra ????p ??n c???a th?? sinh l?? ????ng. ????y l?? l???a ch???n
                    d??nh cho c??c checker ???????c vi???t b???ng <code>Python 3</code>,
                    H??y upload file n??y v??o tr?????ng <code>Custom Checker</code>.
                  </p>
                  <p>
                    Nh??n chung, checker Py3 s??? c?? m???t h??m <code>check</code> s???
                    ???????c g???i b???i m??y ch???m, v?? tr??? v??? c??c ?????i t?????ng
                    <code>CheckerResult</code> b??o r???ng ????ng/Sai. Tham kh???o
                    checker sau cho b??i{" "}
                    <a href="/admin/problem/SUM42">
                      <code>SUM42</code>
                    </a>
                    . B??i n??y y??u c???u th?? sinh in ra <code>n</code> c???p s???
                    nguy??n c?? t???ng l?? <code>42</code>.
                  </p>
                  <pre>
                    <code>
                      {`
      from dmoj.result import CheckerResult
      def WA(feedback):
        return CheckerResult(False, 0, feedback)
      def AC(feedback):
        return CheckerResult(True, 0, feedback)

      def check(participant_output, judge_output, judge_input, **kwargs):
        output_tokens = participant_output.split()
        input_tokens = judge_input.split()
        ## Ch??ng ta kh??ng c???n d??ng ?????n judge_output cho b??i n??y
        # answer_tokens = judge_output.split()

        n = int(input_tokens[0]) # Token ?????u ti??n trong input l?? s??? nguy??n n

        # Check n???u output in ra ??t/nhi???u h??n mong ?????i
        if len(output_tokens) != n*2:
          return WA('Output thi???u ho???c th???a s???')

        # Check n???u c?? token kh??ng ph???i s??? nguy??n
        try:
          input_tokens = [int(token) for token in input_tokens]
        except ValueError:
          return WA('Output ch??? ???????c ph??p ch???a s??? nguy??n')

        # Check r???ng bu???c: s??? nguy??n l???n h??n 10^9
        for num in input_tokens:
          if abs(num) > 10**9:
            return WA('Output ch???a s??? nguy??n c?? gi?? tr??? tuy???t ?????i l???n h??n 1 t???.')

        # Ki???m tra t???ng hai s???
        for i in range(n):
          a, b = int(output_tokens[i*2]), int(output_tokens[i*2+1])
          if a + b != 42:
            return WA(f"C???p s??? th??? {i+1} c?? t???ng kh??c 42.")

        # OK acceptted
        return True`}
                    </code>
                  </pre>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="9" className="custom-checker-c++-help">
                <Accordion.Header>Custom Checker: C++17</Accordion.Header>
                <Accordion.Body className="p-1">
                  <p>
                    <code>custom-checker</code>
                    s??? d???ng cho nh???ng b??i c?? nhi???u ????p ??n, c???n ph???i c?? m???t c??ch
                    ????? ki???m tra ????p ??n c???a th?? sinh l?? ????ng. ????y l?? l???a ch???n
                    d??nh cho c??c checker ???????c vi???t b???ng <code>C++17</code>, H??y
                    upload file n??y v??o tr?????ng <code>Custom Checker</code>.
                  </p>
                  <p>
                    M??y ch???m s??? compile checker tr?????c v?? cache n?? ????? th???c hi???n
                    checking. M???t s??? tham s??? c?? th??? truy???n v??o
                    <code>args</code> nh?? sau:
                    <ul>
                      <li>
                        <code>time_limit</code>: Gi???i h???n th???i gian ch???y cho
                        checker. H??? th???ng ?????t th??m +2s cho checker. M???c ?????nh:{" "}
                        <code>env['generator_time_limit']</code> (c???a m??i tr?????ng
                        m??y ch???m)
                      </li>
                      <li>
                        <code>memory_limit</code>: Gi???i h???n memory cho checker.
                        M???c ?????nh: <code>env['generator_memory_limit']</code>{" "}
                        (c???a m??i tr?????ng m??y ch???m)
                      </li>
                      <li>
                        <code>feedback</code>: N???u l?? <code>true</code>, hi???n
                        th??? stdout c???a checker nh?? l?? feedback t???ng testcase.
                        M???c ?????nh: <code>true</code>
                      </li>
                      <li>
                        <code>cached</code>: N???u l?? <code>true</code>, file
                        binary s??? ???????c cached l???i ????? tr??nh compile l???i. M???c
                        ?????nh: <code>true</code>
                      </li>
                    </ul>
                  </p>
                  <p>
                    Nh??n chung, ch????ng tr??nh s??? nh???n 3 tham s??? theo th??? t???{" "}
                    <code>
                      input_file, participant_output_file, answer_file
                    </code>
                    , 3 tham s??? n??y ???????c truy???n v??o t??? ?????ng b???i M??y ch???m, ng?????i
                    so???n ????? kh??ng c???n b???n t??m v??? vi???c n??y. N???u ch????ng tr??nh
                    checker tr??? v??? 0, k???t qu??? l?? AC. Tr??? v??? 1, k???t qu??? l?? WA.
                    Tr??? v??? 7 c??ng v???i m???t output ra stderr ??? ?????nh d???ng
                    <code>points X</code> v???i <code>X</code> l?? m???t s??? nguy??n,
                    ngh??a l?? th?? sinh ???????c th?????ng <code>X</code> ??i???m cho case
                    n??y. T???t c??? m?? c??n l???i g??y ra IE.
                  </p>
                  <p>
                    V?? d??? checker sau ki???m tra 2 s??? nguy??n ?????u ti??n trong output
                    th?? sinh c?? t???ng b???ng n, s??? nguy??n ?????u ti??n trong judge
                    input:
                  </p>
                  <pre>
                    <code>
                      {`
      #include <bits/stdc++.h>
      using namespace std;

      int __ac() { exit(0); }
      int __wa() { exit(1); }
      int __partial(int pts=0) { cerr<<"points "<<pts; exit(7); }

      int main(int argc, char* argv[]) {
        ifstream inp(argv[1]); // Judge Input
        ifstream out(argv[2]); // Participant Output
        ifstream ans(argv[3]); // Judge Answer

        int n; inp >> n;
        int a, b; out >> a >> b;
        if (a + b == n) __ac();
        else __wa();
      }`}
                    </code>
                  </pre>
                  <p>
                    Ta c?? th??? ki???m tra checker t???i local ho???t ?????ng hay kh??ng
                    b???ng c??ch compile n?? v?? ch???y l???nh sau r???i ki???m tra{" "}
                    <code>exitcode</code> c???a checker.
                  </p>
                  <pre>
                    <code>
                      {`
      g++ checker.cpp -o checker.exe
      checker.exe 1.in my_output.txt 1.out
      `}{" "}
                    </code>
                  </pre>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item
                eventKey="10"
                className="interactive-cheker-c++-help"
              >
                <Accordion.Header>Interactive Checker: C++17</Accordion.Header>
                <Accordion.Body className="p-1">
                  <p>
                    L?? checker d??nh cho c??c b??i t???p t????ng t??c (
                    <code>interactive</code>), ngh??a l?? y??u c???u th?? sinh
                    implement m???t thu???t to??n online, hay ph???i checker ph???i t???o
                    ra input d???a v??o output c???a th?? sinh. ?????u <code>stdin</code>{" "}
                    c???a interactor ???????c n???i v???i ?????u <code>stdout</code> c???a
                    submission, v?? ng?????c l???i. Kh??ng nh???t thi???t ph???i flush sau
                    khi output, nh??ng khuy???n ngh??? n??n flush. ??? C++, ch??ng ta
                    flush b???ng vi???c xu???t ra <code>std::flush</code> sau khi
                    output, ho???c xu???t ra <code>std::endl</code> ????? v???a newline
                    v?? v???a flush.
                  </p>
                  <p>
                    Interactor c?? exitcode l?? <code>0</code> t????ng ???ng v???i AC,
                    l?? <code>1</code> t????ng ???ng v???i WA.
                  </p>
                  <p>
                    M???t v??i option cho <code>args</code> nh?? sau:
                  </p>
                  <ul>
                    <li>
                      <code>flags</code>: c??c c??? ????? truy???n v??o cho compiler
                    </li>
                    <li>
                      <code>compiler_time_limit</code>: gi???i h???n th???i gian
                      compile interactor (gi??y)
                    </li>
                    <li>
                      <code>preprocessing_time</code>: gi???i h???n th???i gian ch???y
                      c???a interactor s??? b???ng gi?? tr??? n??y c???ng v???i{" "}
                      <code>time_limit</code> c???a problem(gi??y)
                    </li>
                    <li>
                      <code>memory_limit</code>: gi???i h???n b??? nh??? cho interactor.
                      Gi?? tr??? m???c ?????nh{" "}
                      <code>env['generator_memory_limit']</code>.
                    </li>
                  </ul>
                  <p>
                    X??t problem sau: Th?? sinh ph???i l???n l?????t ?????c nh???ng word t???
                    stdin v?? output ra l???i word ???? ngay sau m???i l???n ?????c. Nh??ng
                    n???u word ???? l?? x??u <code>"EXIT"</code> th?? d???ng ch????ng
                    tr??nh. ????y l?? interactor t????ng ???ng v???i problem ????:
                  </p>
                  <pre>
                    <code>
                      {`
      #include <iostream>
      #include <fstream>
      using namespace std;

      void __ac(string msg="OK") {
        cerr << msg << endl;
        exit(0);
      }

      void __wa(string msg="Output is wrong") {
        cerr << msg << endl;
        exit(1);
      }

      int main(int argc, char *argv[]) {
        // inp l?? d??? li???u ?????u v??o (file .in trong zip)
        ifstream inp (argv[1]);

        string word;
        bool terminated = false;

        while (inp >> word) {
          string tmp;
          // Xu???t word ra stdout, th?? sinh c?? th??? ?????c word n??y t??? stdin
          cout << word << endl;
          if (word == "EXIT") terminated = true;
          if (terminated) {
            if(cin >> tmp) __wa("program should be terminated already");
            continue;
          }
          // ?????c t??? stdin, l?? stdout c???a th?? sinh
          cin >> tmp;
          if (tmp != word) __wa(string("Expected '")+word+"' but got '"+tmp+"' instead");
        }
        __ac();
      }
      `}
                    </code>
                  </pre>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>
      </Form>
    );
  }
}
