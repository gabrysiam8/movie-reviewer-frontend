  import React, { Component } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import AuthService from '../../service/AuthService';
import EmailModal from './EmailModal';

class LoginForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            emailModal: false,
            showMessage: false,
            message: "",
            validated: false
        };

        this.handleForgotPassword = this.handleForgotPassword.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleForgotPassword(event) {
        this.setState({
            emailModal: <EmailModal hide={this.hideModal} email="" type=""/>
        });
    }

    hideModal() {
        this.setState({
            emailModal: null
        });
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
          event.stopPropagation();
        } else {
            this.refs.btn.setAttribute("disabled", "disabled"); 

            const { username, password } = this.state;
            const { history } = this.props;
            
            AuthService
                .login(username, password)
                .then(res => {
                    AuthService.registerSuccessfulLogin(username, res.data.token);
                    this.props.userHasAuthenticated(true);
                    history.push('/');
                })
                .catch(err => {
                    this.props.userHasAuthenticated(false);
                    this.setState({
                        showMessage: true,
                        message: err.response.data
                    });
                    this.refs.btn.removeAttribute("disabled");
                });
        }
        this.setState({ validated: true });
    }

    render() {
        return (
            <div className="LoginForm">
                <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmit} >
                    <Form.Group controlId="username">
                        <Form.Label>Username</Form.Label>
                        <Form.Control required type="text" name="username" placeholder="Username" onChange={this.handleChange}/>
                    </Form.Group>
                    
                    <Form.Group className="passwordInput" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control required type="password" name="password" placeholder="Password" onChange={this.handleChange}/>
                        <Button variant="link" size="sm" onClick={this.handleForgotPassword}>Forgot your password?</Button>
                    </Form.Group>
                    
                    <Button ref="btn" variant="info" type="submit">
                        Log in
                    </Button>
                </Form>
                {this.state.showMessage ? 
                    <Alert className="dangerAlert" variant="danger">
                        <p>{this.state.message}</p>
                    </Alert>
                    :
                    null
                }
                {this.state.emailModal}
            </div>
        );
    }
}

export default LoginForm;