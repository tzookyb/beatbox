import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
var timeoutId = null;

const _Notify = (props) => {
    const { notify } = props;
    const [isShown, setIsShown] = useState(false);

    useEffect(() => {
        clearTimeout(timeoutId);
        setIsShown(true);
        timeoutId = setTimeout(() => {
            setIsShown(false);
        }, 2000);
    }, [notify])

    const notifyClass = isShown && notify ? 'shown' : '';

    return (
        <div className="flex justify-center">
            <div className={`notify ${notifyClass}`}>
                {notify}
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        notify: state.msgReducer.notify
    }
}

export const Notify = connect(mapStateToProps)(_Notify);