  
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import AuthService from '../../service/AuthService';
import AppliedRoute from './AppliedRoute';

class AuthenticatedRoute extends Component {
    render() {
        if (AuthService.isAuthenticated()) {
            return <AppliedRoute {...this.props} />
        } else {
            return <Redirect to="/login" />
        }

    }
}

export default AuthenticatedRoute;