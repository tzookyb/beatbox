import React, { Component } from 'react';
import { connect } from 'react-redux';

class _App extends Component {
  state = {

  }

  componentDidMount() {
  }

  render() {
    return (
      <div>
        <h1>Hello World</h1>
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