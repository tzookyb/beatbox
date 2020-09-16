import React, { Component } from 'react'
import Footer from '../cmps/Footer'
import { BoxApp } from './BoxApp'

export class Home extends Component {
    render() {
        return (
            <div>
                <div className="hero-container flex justify-center align-center">
                    <div className="hero-txt flex align-center column">
                        <h1>Share the beat...</h1>

                        <a href="#box"><button>Get Started!</button></a>
                    </div>
                </div>
                <Footer/>
            </div>
        )
    }
}
