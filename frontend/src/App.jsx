import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import SongPick from './cmps/BoxDetails/SongPick';
import Header from './cmps/Header';
import { Player } from './cmps/Player';
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
<<<<<<< HEAD
      <div className="App">
        <Header />
        <main>
          <Switch>
            <Route component={BoxEdit} path="/box/edit/:id?" />
            <Route component={BoxDetails} path="/box/:boxId" />
            <Route component={UserDetails} path="/user/:id" />
            <Route component={BoxApp} path="/box" />
            <Route component={Home} path="/" />
          </Switch>
        </main>
=======
      <div id="page-top" className="main-container">
        <Player></Player>
        {/* <Header />
        <Switch>
<<<<<<< HEAD
        <Route component={BoxAdd} path="/box/add/"/>
        <Route component={BoxDetails} path="/box/:id"/>
        <Route component={UserDetails} path="/user/:id"/>
        <Route component={BoxApp} path="/box"/>
        <Route component={Home} path="/"/>
        </Switch>
=======
          <Route component={BoxEdit} path="/box/edit/:id?" />
          <Route component={BoxDetails} path="/box/:id" />
          <Route component={UserDetails} path="/user/:id" />
          <Route component={BoxApp} path="/box" />
          <Route component={Home} path="/" />
        </Switch> */}
>>>>>>> e14778ca0fcb5d6b64cca5bce99e1dcbce686dff
>>>>>>> 3f6d4f96feded7b30a6a9b76b2eac55060a61c2f
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