import React from "react";
import {toast} from "react-toastify";
import {Navigate} from "react-router-dom";
import {Button, Tabs, Tab} from "react-bootstrap";
import {
  FaGlobe,
  FaRegTrashAlt,
  FaChartLine,
  FaRegCalendarAlt,
  FaInfo,
} from "react-icons/fa";
import {BsUpcScan} from "react-icons/bs";

import {General, Participation, Problem} from "./_";

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import contestAPI from "api/contest";
import {SpinLoader, ErrorBox} from "components";
import {withParams} from "helpers/react-router";
import {setTitle} from "helpers/setTitle";

import "./Details.scss";

class RateButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rateInfo: null,
      fetchingInfo: false,
      confirmRate: false,
    };
  }

  fetchRejudgeInfo() {
    const data = {key: this.props.ckey};
    this.setState({fetchingInfo: true}, () => {
      contestAPI
        .infoRateContest(data)
        .then(res => {
          let conf = window.confirm(res.data.msg + " Proceed?");
          this.setState({confirmRate: conf});
        })
        .catch(err => {
          let msg = `Cannot get Rating info. (${err.response.status})`;
          if (err.response.data.detail) msg = err.response.data.detail;
          toast.error(msg, {toastId: `contest-cant-rate-${msg}`});
        })
        .finally(() => this.setState({fetchingInfo: false}));
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.confirmRate === false && this.state.confirmRate === true) {
      const data = {key: this.props.ckey};
      contestAPI
        .rateContest(data)
        .then(() => toast.success(`OK Rated contest ${this.props.ckey}.`))
        .catch(() => toast.error("Cannot rate at the moment."));
    }
  }

  clickHandler(e) {
    e.preventDefault();
    if (this.state.confirmRate) {
      alert("Please refresh if you want to re-rate this contest.");
      return;
    }
    this.fetchRejudgeInfo();
  }

  render() {
    const {fetchingInfo, confirmRate} = this.state;

    return (
      <Button
        className="btn-svg"
        size="sm"
        variant={!confirmRate ? "success" : "light"}
        onClick={e => this.clickHandler(e)}
      >
        <FaChartLine size={16} />
        <span className="d-none d-md-inline">
          {fetchingInfo ? <SpinLoader margin="0" /> : <>Rate?</>}
        </span>
      </Button>
    );
  }
}

class AdminContestDetails extends React.Component {
  constructor(props) {
    super(props);
    const {key} = this.props.params;
    this.key = key;
    this.state = {
      loaded: false,
      errors: null,
      data: undefined,
    };
  }

  refetch() {
    contestAPI
      .getContest({key: this.key})
      .then(res => {
        this.setState({
          data: res.data,
          loaded: true,
        });
      })
      .catch(err => {
        this.setState({
          loaded: true,
          errors:
            {errors: err.response.data} ||
            `Cannot load contest. (${err.response.status})`,
        });
      });
  }

  componentDidMount() {
    setTitle(`Admin | Contest ${this.key}`);
    this.refetch();
  }

  deleteObjectHandler() {
    let conf = window.confirm(
      "X??a Contest n??y s??? x??a T???T C??? t??i nguy??n li??n quan v???i n?? " +
        "(ContestSubmissions v???i Submission t????ng ???ng, ContestParticipation, ContestProblem (nh??ng kh??ng x??a Problem)). " +
        "B???n v???n mu???n x??a?"
    );
    if (conf) {
      contestAPI
        .deleteContest({key: this.key})
        .then(() => {
          toast.success("OK Deleted.");
          this.setState({redirectUrl: "/admin/contest/"});
        })
        .catch(err => {
          toast.error(`Cannot delete. (${err})`);
        });
    }
  }

  render() {
    if (this.state.redirectUrl)
      return <Navigate to={`${this.state.redirectUrl}`} />;

    const {loaded, errors, data} = this.state;
    let standingRecomputeCss = "light";
    if (loaded && !errors) {
      if (data.standing_outdated_reason) standingRecomputeCss = "danger";
      else if (data.modified != data.standing_date)
        standingRecomputeCss = "warning";
    }

    return (
      <div className="admin contest-panel wrapper-vanilla">
        <h4 className="contest-title">
          <div className="panel-header">
            <span className="title-text text-truncate">
              {`Contest | ${this.key}`}
              {!loaded && (
                <span>
                  <SpinLoader />
                </span>
              )}
            </span>
            {loaded && !errors && (
              <>
                <span className="d-flex">
                  <Button
                    className="btn-svg"
                    size="sm"
                    variant="dark"
                    onClick={() =>
                      this.setState({redirectUrl: `/contest/${this.key}`})
                    }
                  >
                    <FaGlobe size={16} />
                    <span className="d-none d-md-inline">View on Site</span>
                  </Button>
                </span>
                <span className="d-flex">
                  <Button
                    className="btn-svg"
                    size="sm"
                    variant="danger"
                    onClick={() => this.deleteObjectHandler()}
                  >
                    <FaRegTrashAlt size={16} />
                    <span className="d-none d-md-inline">Delete</span>
                  </Button>
                </span>
              </>
            )}
          </div>
        </h4>
        <hr />
        <div className="contest-details">
          {!loaded && (
            <span>
              <SpinLoader /> Loading...
            </span>
          )}
          <ErrorBox errors={this.state.errors} />
          {loaded && !errors && (
            <>
              <div className="m-1 p-1">
                <h6>More Actions:</h6>
                <div className="flex-center">
                  <div className="p-1 border flex-center-col">
                    <span className="d-flex">
                      <RateButton
                        ckey={this.key}
                        setErrors={e => this.setState({errors: e})}
                      />
                      <OverlayTrigger
                        placement="bottom"
                        overlay={
                          <Tooltip>
                            <ul
                              style={{fontSize: "14px"}}
                              className="text-left m-0 pl-3 w-100"
                            >
                              <li>
                                Contest l?? contest{" "}
                                <code>
                                  {data.is_rated
                                    ? "X???p h???ng"
                                    : "Kh??ng x???p h???ng"}
                                </code>
                                .
                              </li>
                              <li>
                                Rating Floor l??{" "}
                                <code>
                                  {data.rating_floor ? data.rating_floor : "0"}
                                </code>
                                .
                              </li>
                              <li>
                                Rating Ceiling l??{" "}
                                <code>
                                  {data.rating_ceiling
                                    ? data.rating_ceiling
                                    : "+???"}
                                </code>
                                .
                              </li>
                            </ul>
                          </Tooltip>
                        }
                      >
                        <Button
                          size="sm"
                          type="button"
                          variant="light"
                          className="ml-1"
                        >
                          <FaInfo />
                        </Button>
                      </OverlayTrigger>
                    </span>
                  </div>

                  <div className="p-1 border flex-center-col">
                    <span className="d-flex">
                      <Button
                        className="btn-svg"
                        size="sm"
                        variant={
                          this.state.recomputeDisabled
                            ? "light"
                            : standingRecomputeCss
                        }
                        disabled={this.state.recomputeDisabled}
                        onClick={() => {
                          contestAPI
                            .recomputeContestStanding({key: data.key})
                            .then(() => {
                              toast.success("OK ???? queue t??c v???.");
                              this.setState({recomputeDisabled: true});
                            })
                            .catch(err => {
                              toast.error(
                                `Kh??ng th??? t??nh l???i b???ng ??i???m. (${err.response.status})`
                              );
                            });
                        }}
                      >
                        <FaRegCalendarAlt size={16} />
                        <span className="d-none d-md-inline">
                          T??nh l???i Standing
                        </span>
                      </Button>
                      <OverlayTrigger
                        placement="bottom"
                        overlay={
                          <Tooltip>
                            <ul
                              style={{fontSize: "14px"}}
                              className="text-left m-0 pl-3 w-100"
                            >
                              <li>
                                Contest: <code>{data.modified}</code>.
                              </li>
                              <li>
                                Standing: <code>{data.standing_date}</code>.
                              </li>
                              {data.standing_outdated_reason ? (
                                <li>
                                  <span>
                                    Standing <strong>c???n ???????c t??nh l???i</strong>.
                                    L?? do:{" "}
                                    <code>{data.standing_outdated_reason}</code>
                                    .
                                  </span>
                                </li>
                              ) : (
                                <li>
                                  <span>
                                    H??? th???ng kh??ng ph??t hi???n ra l?? do c???n t??nh
                                    l???i.{" "}
                                    {data.modified !== data.standing_date
                                      ? "Tuy nhi??n, contest v???a ???????c update g?? ???? c?? th??? kh??ng li??n quan ?????n standing."
                                      : ""}
                                  </span>
                                </li>
                              )}
                            </ul>
                          </Tooltip>
                        }
                      >
                        <Button
                          size="sm"
                          type="button"
                          variant="light"
                          className="ml-1"
                        >
                          <FaInfo />
                        </Button>
                      </OverlayTrigger>
                    </span>
                  </div>
                  <div className="p-1 border flex-center-col">
                    <span className="d-flex">
                      <Button
                        className="btn-svg"
                        size="sm"
                        variant="light"
                        disabled
                        onClick={() => {}}
                      >
                        <BsUpcScan size={16} />
                        <span className="d-none d-md-inline">
                          Ki???m tra ?????o code
                        </span>
                      </Button>
                    </span>
                  </div>
                </div>
              </div>

              <div className="m-1 p-1">
                <h6>Settings:</h6>
                <Tabs defaultActiveKey="general" id="general" className="pl-2">
                  <Tab eventKey="general" title="General">
                    <General
                      ckey={this.key}
                      data={data}
                      refetch={() => this.refetch()}
                    />
                  </Tab>
                  <Tab eventKey="prob" title="Problems">
                    <Problem ckey={this.key} />
                  </Tab>
                  <Tab eventKey="part" title="Participations">
                    <Participation ckey={this.key} />
                  </Tab>
                  {/* <Tab eventKey="sub" title="Submissions">
                <Submission
                />
              </Tab> */}
                </Tabs>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
}

let wrappedPD = AdminContestDetails;
wrappedPD = withParams(wrappedPD);
export default wrappedPD;
// const mapStateToProps = state => {
//     return { user : state.user.user }
// }
// wrappedPD = connect(mapStateToProps, null)(wrappedPD);
