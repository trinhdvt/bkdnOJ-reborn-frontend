import React from 'react';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';

import { Link, Outlet } from 'react-router-dom';
import { VscError } from 'react-icons/vsc';

import { ListSidebar, OneColumn } from 'layout';

import { SpinLoader, ErrorBox,
  ContestSidebar,
} from 'components';

import contestAPI from 'api/contest';
import { setTitle } from 'helpers/setTitle';
import { withParams, withNavigation } from 'helpers/react-router';

import 'styles/ClassicPagination.scss';
import './ContestApp.scss';

// Context Components
import {
  ContestNav, ContestBanner, ContestController,
} from './_';

// Context
import ContestContext, { ContestProvider } from 'context/ContestContext';

/*

  [ Nav ---------------------------------------- ]

  [                   Contest                    ]
  [             Time Left: 00:15:09              ]
  [ -------------------------------------------- ]
  [ Prob | Sub | Standing                        ]

  [                       ] [                    ]
  [                       ] [  Other component   ]
  [         BODY          ] [                    ]
  [                       ]
  [                       ]

*/
class ContestApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded : false,
      contest_key: this.props.params.key,
      contest: null,
      redirectUrl: null,

      showNav: true,
    }
  }

  componentDidMount() {
    contestAPI.getContest({key : this.state.contest_key})
    .then((res) => {
      this.setState({
        contest: res.data,
        loaded: true,
      })
    })
    .catch((err) => {
      this.setState({
        loaded: true,
        errors: err,
      })
      toast.error(`Contest is not available. (${err.response.status})`, {
        toastId: "contest-na",
      })
      // this.props.navigate( -1, { replace: true } )
    })
  }

  render() {
    const { contest, loaded, showNav } = this.state;

    let mains = (
      contest ? [
        <ContestBanner contestLoaded={loaded} contest={contest} />,
        <ContestNav />,
        <Outlet/>
      ] :
        !loaded ? [<div className="shadow flex-center" style={{ "height": "200px" }}>
            <SpinLoader margin="0"/>
          </div>]
        : [ <div className="shadow flex-center-col" style={{ "height": "200px" }}>
              <h4>Contest Not Available</h4>
              <hr style={{width: "50%"}} className="mt-1"/>
              <VscError size={30} color="red"/>
            </div>
        ]
    )
    // console.log(mains)
    // if (showNav) mains.splice(1, 0, <ContestNav/>)

    return (
      <div id="contest-app">
        <ContestProvider value={ {contest} }>
          {
            contest && <ContestController
            showNav={showNav} setShowNav={(v)=>this.setState({showNav: v})} ckey={contest.key}
            />
          }
          <OneColumn mainContent={mains}/>
        </ContestProvider >
      </div>
    )
  }
}

let wrapped = withParams(ContestApp);
wrapped = withNavigation(wrapped);

const mapStateToProps = state => {
  return {
    user: state.user.user,
    // profile: state.profile.profile,
    contest: state.contest.contest,
  }
}
export default connect(mapStateToProps, null)(wrapped);
