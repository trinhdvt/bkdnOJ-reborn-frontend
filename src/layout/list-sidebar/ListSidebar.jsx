import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { log } from 'helpers/logger';

import './ListSidebar.scss';
import OutsideAlerter from 'helpers/OutsiderAlerter';

class Offcanvas extends React.Component {
  render() {
    const sideComponents = this.props.sideComponents;

    return (
      <div id="offcanvas" className="offcanvas">
        {
          sideComponents.map( (comp, indx) => (
            <div key={`side-component-${indx}`} 
              className="side-component rounded">
              {comp}
            </div>
          ))  
        }

        <div className="offcanvasCloseBtn-wrapper">
          <Button id="offcanvasCloseBtn" className="offcanvasCloseBtn btn-dark hidden" onClick={() => this.props.closeCanvas()}>
            ⭲
          </Button>
        </div>
      </div>
    )
  }
}

class MainContent extends React.Component {
  render() {
    const children = this.props.children || (
      <>
        <h2>Offcanvas Push Example</h2>
        <p>Please pass a React component to `children` in order to replace this message.</p>
      </>
    )

    return (
      <div className="offcanvas-menu border border-primary" id="offcanvas-menu">
        { children }
        <div className="offcanvasOpenBtn-wrapper">
          <Button className="offcanvasOpenBtn btn-dark" onClick={() => this.props.toggle()}>
            ⭰
          </Button>
        </div>
      </div>
    )
  }
}

/*
 * A better name would be 8-4 layout. This layout will display
   main content by 8 | side content 4 on wide screen. On mobile,
   side content will be put onto an off-canvas, that can be accessed
   by a fixed button on the bottom
 * params:
     - mainContent: a React Component, will appear in the main content section
     - sideComponents: a list of React Components, appear on the side or off-canvas
 */
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
    const mainContent = this.props.mainContent || (<p>This is main content</p>);
    const sideComponents = this.props.sideComponents || [
      (<p> Component 1 </p>),
      (<p> Component 2 </p>),
      (<p> Component 3 </p>),
    ]

    return (
      <div className="list-sidebar-wrapper">
        <Row className="d-block d-md-none row">
          <OutsideAlerter 
            children={ 
              <Offcanvas 
                closeCanvas={() => this.close()}
                sideComponents={sideComponents}
              /> 
            }
            isDetecting={this.state.offcanvasShow}
            outsideClickHandler={() => this.close()}
          />

          <MainContent toggle={() => this.toggle()}
            children={mainContent}
          />

        </Row>

        <Row className="d-none d-md-flex row">
          <Col md={8} className='table-col center border border-primary'>
            { mainContent }
          </Col>
          <Col md={4} className="comp-col center border border-warning">
            {
              sideComponents.map( (comp, indx) => (
                <div key={`side-component-${indx}`} className="border border-danger">
                  {comp}
                </div>
              ))  
            }
          </Col> 
        </Row> 
      </div>
    )
  }

  toggle() {
    const bool = this.state.offcanvasShow;
    if (bool) this.close();
    else this.open();
  }

  open() {
    this.setState({offcanvasShow: true}, () => {
      const sidenav = document.getElementById("offcanvas")
      if (sidenav) sidenav.style.width = "350px";
      // const main = document.getElementById("offcanvas-menu")
      // if (main) main.style.marginRight = "250px";
    })
  }
  close() {
    this.setState({offcanvasShow: false}, () => {
      const sidenav = document.getElementById("offcanvas")
      if (sidenav) sidenav.style.width = "0";
      // const main = document.getElementById("offcanvas-menu")
      // if (main) main.style.marginRight = "0";
    })
  }
};
