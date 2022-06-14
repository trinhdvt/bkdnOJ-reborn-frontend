import React from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import {
  Form, Row, Col, Table, Button
} from 'react-bootstrap';

import contestAPI from 'api/contest';
import {ErrorBox, SpinLoader} from 'components';

const INIT_CONT_PROBLEM = {
  points: 1,
  partial: false,
  is_pretested: false,
  max_submissions: null,
};

class Problem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ckey: this.props.ckey,
      problems: [],

      loaded: false,
      errors: null,
    }
  }

  refetch() {
    contestAPI.getContestProblems({key: this.state.ckey})
    .then((res) => {
      this.setState({
        loaded: true,
        problems: res.data.results,
      })
    })
    .catch((err) => {
      console.log(err);
      this.setState({
        loaded: true,
        errors: [err.response.detail]
      })
    })
  }

  componentDidMount() {
    this.refetch();
  }

  // ---------
  clarifyPopup(msg) { return <Link to="#" onClick={() => alert(msg)}>?</Link> }

  // ---------
  problemChangeHandler(idx, e, params={}) {
    const problems = this.state.problems;
    let prob = problems[idx];

    const isCheckbox = params.isCheckbox || false;
    if (!isCheckbox) {
      if (e.target.id === 'order')
        prob[e.target.id] = parseInt(e.target.value)
      else
        prob[e.target.id] = e.target.value
    } else prob[e.target.id] = !prob[e.target.id]

    this.setState({
      problems: problems.map( (p) => p===prob.id?prob:p )
    })
  }

  // -------- Form Submit
  formSubmitHandler(e) {
    e.preventDefault();
    let conf = window.confirm('Bạn có chắc chắn với thay đổi này?')
    if (conf)
      contestAPI.updateContestProblems({key: this.state.ckey, data: this.state.problems})
      .then((res) => {
        toast.success('OK Updated.')
        // this.refetch();
      })
      .catch((err) => {
        console.log(err)
        this.setState({errors: err.response.data})
      })
  }

  render() {
    const { loaded, errors, problems } = this.state;

    return (
      <>
      <div className="table-wrapper m-2">

        <div className="options mb-1">
          <div className="border d-inline-flex p-1">
            <Button size="sm" variant="dark" onClick={() => {
              let probs = problems.slice()
              probs.sort((p1, p2) => {
                const v1 = isNaN(p1.order) ? 9999 : p1.order;
                const v2 = isNaN(p2.order) ? 9999 : p2.order;
                return (v1 < v2 ? -1 : 0);
              })
              console.log(probs)
              this.setState({problems: probs})
            }}>Sắp xếp theo Order</Button>
          </div>
          <div className="border d-inline-flex p-1">
            <Button size="sm" variant="dark" onClick={() => {
              let probs = problems.slice() // Copy array
              for (let i=0; i<problems.length; i++) probs[i].order = i
              this.setState({problems : probs})
            }}>Tự đánh số Order từ trên xuống</Button>
          </div>
          <div className="border d-inline-flex p-1">
            <Button size="sm" variant="dark" onClick={() => {
              this.setState({errors: null}); this.refetch()
            }}>Reset</Button>
          </div>
        </div>

        <hr className="m-2"/>

        <div className="admin-table">
        <ErrorBox errors={errors} />
        <Table responsive hover size="sm" striped bordered className="rounded mb-0">
          <thead>
            <tr>
              <th style={{whiteSpace: "nowrap"}} >
                Order {this.clarifyPopup('Quyết định thứ tự xuất hiện của các Problem ở trong Contest. '+
                  'Ngoài ra, hệ thống sử dụng giá trị Order để sinh ra nhãn (problem A, problem B,...).')}
              </th>

              <th style={{minWidth: "150px"}}>Problem Code</th>
              <th style={{minWidth: "15%"}}>Points</th>
              <th style={{whiteSpace: "nowrap"}} >
                Cắn Test {this.clarifyPopup('Chấm bài ở chế độ ăn điểm từng test (oi). Nhưng thông thường chỉ với thiết lập Contest Format là đủ.')}
              </th>
              <th style={{whiteSpace: "nowrap"}} >
                Pretested {this.clarifyPopup('Chỉ chấm với Pretest.')}
              </th>
              <th style={{whiteSpace: "nowrap"}} >
                Max Subs {this.clarifyPopup('Giới hạn số lần nộp bài tối đa cho phép. Để trống nếu cho phép nộp không giới hạn.')}
              </th>
              <th></th>
              {/* <th >
                <Link to="#" onClick={(e) => this.handleDeleteSelect(e)}>Actions</Link>
              </th> */}
            </tr>
          </thead>
          <tbody>
          {
            !loaded && <tr><td colSpan={99}><SpinLoader margin="20px" /></td></tr>
          }{
            loaded && problems.length === 0 && <tr><td colSpan={99}><em>No problems added yet.</em></td></tr>
          }{
            loaded && problems.length > 0 && problems.map((prob, ridx) =>
              <tr key={`ct-pr-${ridx}`}><td>
                <Form.Control size="sm" type="number" id="order" value={isNaN(prob.order) ? '' : prob.order}
                                onChange={(e) => this.problemChangeHandler(ridx, e)} />
                </td>
                <td style={{minWidth: "150px"}}>
                  <Form.Control size="sm" type="text" id="shortname" value={prob.shortname || ''}
                                onChange={(e) => this.problemChangeHandler(ridx, e)} />
                </td>
                <td> <Form.Control size="sm" type="number" id="points" value={prob.points || ''}
                                onChange={(e) => this.problemChangeHandler(ridx, e)} />
                </td>
                <td> <Form.Control size="sm" type="checkbox" id="partial" checked={prob.partial || false}
                                onChange={(e) => this.problemChangeHandler(ridx, e, {isCheckbox: true})} />
                </td>
                <td> <Form.Control size="sm" type="checkbox" id="is_pretested" checked={prob.is_pretested || false}
                                onChange={(e) => this.problemChangeHandler(ridx, e, {isCheckbox: true})} />
                </td>
                <td> <Form.Control size="sm" type="number" id="max_submissions" value={prob.max_submissions || ''}
                                onChange={(e) => this.problemChangeHandler(ridx, e)} />
                </td>
                <td><Link to="#" onClick={(e) => {
                  e.preventDefault()
                  let conf = window.confirm('CHÚ Ý: Xóa một đối tượng ContestProblem có sẵn sẽ dẫn đến hiện tượng Data Corruption: '+
                    'gây ảnh hưởng đến những ContestSubmission và ContestParticipation tương ứng, nhất là khi Contest đang và đã diễn ra. '+
                    'Hãy suy xét lựa chọn đổi thứ tự chúng thông qua Order thay vì xóa đi tạo lại một Problem. Một khi nhấn SAVE, sẽ không '+
                    'thể khôi phục lại những tài nguyên tương ứng.')
                  if (conf) this.setState({problems: problems.filter((_, i) => i !== ridx) })
                }}>Delete</Link>
                </td></tr>
            )
          }
          </tbody>
        </Table>
        </div>

        <Row className="mt-2">
          <Col xs={8}></Col>
          <Col sm={2}>
            <Button size="sm" variant="dark" style={{width: "100%"}}
              onClick={() => this.setState({ problems: problems.concat({...INIT_CONT_PROBLEM}) })}> Add </Button>
          </Col>
          <Col sm={2}>
            <Button size="sm" variant="danger" style={{width: "100%"}}
              onClick={(e) => this.formSubmitHandler(e)}> Save </Button>
          </Col>
        </Row>
      </div>
      </>
    )
  }
};

let wrapped = Problem;
export default wrapped;
