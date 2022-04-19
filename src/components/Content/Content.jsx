import React, { useState } from 'react';
import { Container } from 'react-bootstrap';

import { connect } from "react-redux"
import { increaseCounter, decreaseCounter, multiplyCounter } from "redux/Counter/actions.js"

import "./Content.scss";

class Content extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          num: 0
        }
    }

    render() {
        const props = this.props;
        const {num} = this.state;

        return (
            <div className="content-div">
                <div className="row d-block">
                    Content goes here.
                </div>

                <div className="row d-block">
                    <div>Count: {props.count}</div>
                    <button onClick={() => props.increaseCounter()}>Increase Count</button>
                    <button onClick={() => props.decreaseCounter()}>Decrease Count</button>
                    <hr></hr>
                    <input type={`input`} value={num} onChange={e => this.setState({num: e.target.value})}/>
                    <button onClick={() => props.multiplyCounter(num)}>Multiply Count</button>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
  return {
    count: state.counter.count,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    increaseCounter: () => dispatch(increaseCounter()),
    decreaseCounter: () => dispatch(decreaseCounter()),
    multiplyCounter: (num) => dispatch(multiplyCounter({multiplier: num})),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Content);