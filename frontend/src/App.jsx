import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import Header from './cmps/Header';
import { BoxApp } from './pages/BoxApp';
import { BoxDetails } from './pages/BoxDetails';
import { BoxAdd } from './pages/BoxAdd';
import { Home } from './pages/Home';
import { UserDetails } from './pages/UserDetails';


class _App extends Component {
  state = {

  }

  componentDidMount() {
  }

  render() {
    return (
      <div className="main">
        <Header/>
        <Switch>
        <Route component={BoxAdd} path="/box/add/"/>
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