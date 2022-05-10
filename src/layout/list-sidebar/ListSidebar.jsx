import React from 'react';
import { Button } from 'react-bootstrap';
import { log } from 'helpers/logger';

import './ListSidebar.scss';
import OutsideAlerter from 'helpers/OutsiderAlerter';

class Offcanvas extends React.Component {
  render() {
    return (
      <div id="offcanvas" className="offcanvas">
        <a className="canvasCloseBtn" onClick={() => this.props.closeCanvas()}>
          ⭲
        </a>

        <a href="#">About</a>
        <a href="#">Services</a>
        <a href="#">Clients</a>
        <a href="#">Contact</a>

      </div>
    )
  }
}

export default class ListSidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list_component: undefined,
      sidebar: [], // a list of components
      offcanvasShow: false,
    }
  }

  render() {
    log(this.state.offcanvasShow)
    const controller = this;
    return (
      <>
        <OutsideAlerter 
          children={ <Offcanvas closeCanvas={() => this.close()}/> }
          isDetecting={this.state.offcanvasShow}
          outsideClickHandler={() => this.close()}
        />
        <div id="offcanvas-menu">
          <h2>Sidenav Push Example</h2>
          <p>Click on the element below to open the side navigation menu, and push this content to the right.</p>
          <span style={{fontSize: "30px", cursor: "pointer"}} onClick={() => this.toggle()}>&#9776; open</span>
        </div>
      </>
      // <Row>
      //   <Col md={8} className='table-col center border border-primary'>
      //     <div className="list">
      //       abcdef
      //     </div>
      //   </Col>
      //   <Col md={4} className='comp-col center border border-warning d-none d-md-block'>
      //     <div className="component-1 border border-danger">
      //       xxxx
      //     </div>
      //     <div className="component-2 border border-danger">
      //       xxxx
      //     </div>
      //     <div className="component-3 border border-danger">
      //       xxxx
      //     </div>
      //   </Col> 
      //  </Row> 
    )
  }

  toggle() {
    const bool = this.state.offcanvasShow;
    if (bool) this.close();
    else this.open();
  }
  setShow(bool) {
    this.setState({offcanvasShow: bool})
  }

  open() {
    const sidenav = document.getElementById("offcanvas")
    if (sidenav) sidenav.style.width = "250px";
    const main = document.getElementById("offcanvas-menu")
    if (main) main.style.marginRight = "250px";
    this.setShow(true)
  }
  close() {
    const sidenav = document.getElementById("offcanvas")
    if (sidenav) sidenav.style.width = "0";
    const main = document.getElementById("offcanvas-menu")
    if (main) main.style.marginRight = "0";
    this.setShow(false)
  }
};
