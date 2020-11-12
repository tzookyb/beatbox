// OUTSOURCE IMPORT
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
// LOCAL IMPORT
import { socketService } from './services/socketService';
import { UserDetails } from './pages/UserDetails';
import { BoxDetails } from './pages/BoxDetails';
import { BoxAdd } from './pages/BoxAdd';
import { Home } from './pages/Home';
import { BoxApp } from './pages/BoxApp';
import { Header } from './cmps/Header';
import { Player } from './cmps/Player';
import { Notify } from './cmps/Notify';
import { gotBoxUpdate, loadBoxes, setActiveBoxes, setBoxStatus, setIsMobile, setIsTouch } from './store/actions/boxActions';
import { updateLocalPlayer } from './store/actions/playerActions';
import { loadUser, loadConnectedUsers } from './store/actions/userActions';
import { addMsg } from './store/actions/msgActions';

class _App extends Component {
  componentDidMount() {
    this.checkTouchDevice();
    this.checkMobile();
    this.props.loadUser();
    this.props.loadBoxes();
    // SOCKETS
    socketService.setup();
    socketService.on('got box status', this.props.setBoxStatus);
    socketService.on('user joined box', this.props.loadConnectedUsers)
    socketService.on('box changed', this.props.gotBoxUpdate);
    socketService.on('chat addMsg', this.props.addMsg);
    socketService.on('got player update', this.props.updateLocalPlayer);
    socketService.on('got active boxes', this.props.setActiveBoxes);
  }

  checkMobile = () => {
    this.props.setIsMobile(window.innerWidth < 720)
  }

  checkTouchDevice = () => {
    try {
      document.createEvent("TouchEvent");
      this.props.setIsTouch(true);
    } catch (err) {
      this.props.setIsTouch(false);
    }
  }

  render() {
    return (
      <div className="App">
        <Header />
        <Notify />
        <main >
          <Route component={BoxAdd} path="**/add" />
          <Switch>
            <Route component={BoxDetails} path="/box/details/:boxId" />
            <Route component={UserDetails} path="/user/:id" />
            <Route component={BoxApp} path="/box" />
            <Route component={Home} path="/" />
          </Switch>
        </main>

        <Player />
      </div>
    )
  }
}

const mapDispatchToProps = {
  setIsTouch,
  setIsMobile,
  loadUser,
  setBoxStatus,
  loadConnectedUsers,
  gotBoxUpdate,
  addMsg,
  updateLocalPlayer,
  setActiveBoxes,
  loadBoxes
}
export const App = connect(null, mapDispatchToProps)(_App);