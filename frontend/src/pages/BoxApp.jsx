import React, { Component } from 'react'
import { BoxDetails } from './BoxDetails'

export class BoxApp extends Component {
    render() {
        return (
            <section className="box-app" id="box">
                {/* <h1>choose your box</h1> */}
                <BoxDetails/>
            </section>
        )
    }
}
