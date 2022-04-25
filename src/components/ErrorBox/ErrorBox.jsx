import React from 'react';
import { log } from 'helpers/logger';

import './ErrorBox.scss';

class ErrorList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            errTitle: props.errTitle,
            errData: props.errData,
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.errTitle !== prevState.errTitle ||
            nextProps.errData !== prevState.errData
        )
            return {
                errTitle: nextProps.errTitle, 
                errData: nextProps.errData,
            };
        return null; 
    }

    render() {
        const { errTitle, errData } = this.state;
        if (errData instanceof Array) 
            return (
                <>
                    <h5 key={errTitle} className="error-sub-title">{errTitle}</h5>
                    <ul>{
                        errData.map((err, idx) => <li key={`${errTitle}-${idx}`}><p>{err}</p></li>)
                    }</ul>
                </>
            )
        else 
            return (
                <>
                    <h5 className="error-sub-title">error</h5>
                    <ul>
                        <li key={`error-msg`}><p>{errData}</p></li>
                    </ul>
                </>
            )
    }
}

export default class ErrorBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = { errors: props.errors, }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.errors !== prevState.errors)
            return { errors: nextProps.errors };
        return null; 
    }

    render() {
        const { errors } = this.state;
        if (errors)
            return (
                <div className="error-box">
                    {
                        Object.keys(errors).map((key, idx) => {
                            return (
                                <div key={idx} className="error-sub">
                                    <ErrorList errTitle={key} errData={errors[key]}/>
                                </div>
                            )
                        })
                    }
                </div>
            )
        else
            return <></>
    }
}