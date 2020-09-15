import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import Header from './cmps/Header';
import { BoxApp } from './pages/BoxApp';
import { BoxDetails } from './pages/BoxDetails';
import { BoxEdit } from './pages/BoxEdit';
import { Home } from './pages/Home';
import { UserDetails } from './pages/UserDetails';


class _App extends Component {
  state = {

  }

  componentDidMount() {
  }

  render() {
    return (
      <div className="main-container">
        <Header/>
        <Switch>
        <Route component={BoxEdit} path="/box/edit/:id?"/>
        <Route component={BoxDetails} path="/box/:id"/>
        <Route component={UserDetails} path="/user/:id"/>
        <Route component={BoxApp} path="/box"/>
        <Route component={Home} path="/"/>
        </Switch>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {

  }
}

const mapDispatchToProps = {

}

export const App = connect(mapStateToProps, mapDispatchToProps)(_App);