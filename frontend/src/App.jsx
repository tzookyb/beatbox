// OUTSOURCE IMPORT
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
// LOCAL IMPORT
import { UserDetails } from './pages/UserDetails';
import { BoxDetails } from './pages/BoxDetails';
import { BoxApp } from './pages/BoxApp';
import { BoxAdd } from './pages/BoxAdd';
import { Home } from './pages/Home';
import { Header } from './cmps/Header';
import { Player } from './cmps/Player';
import { socketService } from './services/socketService';
import { loadConnectedUsers, setGlobalUsers } from './store/actions/connectedUsersAction';
import { gotBoxUpdate, setBoxStatus } from './store/actions/boxAction';
import { addMsg } from './store/actions/msgAction';
import { setSeekTo, updateLocalPlayer } from './store/actions/playerActions';
// import { Login } from './cmps/user/Login';
class _App extends Component {
  componentDidMount() {
    socketService.setup();
    socketService.on('got global users', this.props.setGlobalUsers);
    socketService.on('joined new box', this.props.loadConnectedUsers);
    socketService.on('got box status', this.props.setBoxStatus);

    socketService.on('box changed', this.props.gotBoxUpdate);
    socketService.on('chat addMsg', this.props.addMsg);
    socketService.on('got player update', this.props.updateLocalPlayer);
    socketService.on('got seek update', this.props.setSeekTo);
    socketService.on('got ')
  }

  render() {
    return (
      <div className="App">
        <Header />
        <main>
          <Switch>
            <Route component={BoxAdd} path="/box/add" />
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

const mapStateToProps = state => {
  return {
  }
}

const mapDispatchToProps = {
  setGlobalUsers,
  setBoxStatus,
  gotBoxUpdate,
  loadConnectedUsers,
  addMsg,
  updateLocalPlayer,
  setSeekTo
}
export const App = connect(mapStateToProps, mapDispatchToProps)(_App);