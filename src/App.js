import 'bootstrap/dist/css/bootstrap.min.css';
import React , { Component } from 'react';
import { Switch } from 'react-router-dom';
import './App.css';
import AuthService from './service/AuthService';
import AppliedRoute from './components/route/AppliedRoute';
import StartPage from './components/StartPage';
import MainMenu from './components/MainMenu';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import MovieDetailsPage from './components/MovieDetailsPage';

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
        <Switch>
          <AppliedRoute path="/" exact component={StartPage} props={childProps}/>
          <AppliedRoute path="/login" exact component={LoginForm} props={childProps}/>
          <AppliedRoute path="/register" exact component={RegisterForm} props={childProps}/>
          <AppliedRoute path="/movie/:movieId" exact component={MovieDetailsPage} props={childProps}/>
        </Switch>
      </div>
    );
  }
}

export default App;
