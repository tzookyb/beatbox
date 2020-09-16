import React from 'react';

export function BoxInfo({ box }) {
    return (
        <div className="box-info flex space-between">
            <div className="info-txt">
                <h1>box info</h1>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur saepe aperiam voluptas necessitatibus, voluptates tempore sit laborum quas, doloremque accusamus culpa quibusdam fugit facilis soluta ut recusandae. Hic, suscipit voluptates.</p>
                <div className="info-creator">
                    Dani
                </div>
            </div>
            <div className="social-params">
                <p>likes</p>
                <p>listeners</p>
            </div>
            <div className="box-img"><img src={require("../../assets/img/bg1.png")} alt="" /></div>
        </div>
    )
}