import 'bootstrap/dist/css/bootstrap.min.css';
import React , { Component } from 'react';
import './App.css';
import AuthService from './service/AuthService';
import MainMenu from './components/MainMenu'

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
        isAuthenticated: false
    };

    this.userHasAuthenticated = this.userHasAuthenticated.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  userHasAuthenticated(authenticated) {
      this.setState({ isAuthenticated: authenticated });
  }

  componentDidMount(){
      this.userHasAuthenticated(AuthService.isAuthenticated());
  }

  handleLogout() {
      AuthService
          .logout();
      this.userHasAuthenticated(false );
  }

  render() {
    const childProps = {
        isAuthenticated: this.state.isAuthenticated,
        userHasAuthenticated: this.userHasAuthenticated,
        onLogout: this.handleLogout
    };
    return (
      <div className="App">
        <MainMenu {...childProps}/>
      </div>
    );
  }
}

export default App;
