import React from 'react';

export function BoxInfo({ box }) {
    return (
        <div className="box-info flex space-between">
            <div className="info-txt flex space-between column">
                <h1>{box.name}</h1>
                <p>{box.description}</p>
                <div className="info-creator">
                    Dani
                </div>
            </div>
            <div className="social-params">
                <p>likes</p>
                <p>listeners</p>
            </div>
            <div className="box-img"><img src={box.imgUrl} alt="" /></div>
        </div>
    )
}