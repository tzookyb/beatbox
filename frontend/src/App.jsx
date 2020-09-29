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
import { loadConnectedUsers } from './store/actions/connectedUsersAction';
import { gotBoxUpdate, loadBoxes, setActiveBoxes, setBoxStatus } from './store/actions/boxAction';
import { addMsg } from './store/actions/msgAction';
import { updateLocalPlayer } from './store/actions/playerActions';

class _App extends Component {
  componentDidMount() {
    this.props.loadBoxes();
    // SOCKETS
    socketService.setup();
    socketService.on('got box status', this.props.setBoxStatus);
    socketService.on('joined new box', this.props.loadConnectedUsers)
    socketService.on('box changed', this.props.gotBoxUpdate);
    socketService.on('chat addMsg', this.props.addMsg);
    socketService.on('got player update', this.props.updateLocalPlayer);
    socketService.on('got active boxes', this.props.setActiveBoxes);
  }


  render() {
    return (
      <div className="App">
        <Header />
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

const mapStateToProps = state => {
  return {
  }
}
const mapDispatchToProps = {
  setBoxStatus,
  gotBoxUpdate,
  loadConnectedUsers,
  addMsg,
  updateLocalPlayer,
  loadBoxes,
  setActiveBoxes
}
export const App = connect(mapStateToProps, mapDispatchToProps)(_App);