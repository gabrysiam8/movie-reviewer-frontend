import React, { Component } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import AuthService from '../../service/AuthService';
import EmailModal from './EmailModal';

class RegisterForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: "",
            username: "",
            password: "",
            passwordConfirmation: "",
            validated: false,
            emailModal: false,
            showMessage: false,
            message: ""
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.hideModal = this.hideModal.bind(this);
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
            const { email, username, password, passwordConfirmation } = this.state;

            if(password !== passwordConfirmation) {
                this.setState({
                    showMessage: true,
                    message: "The Password confirmation must match Password!"
                });
                this.refs.btn.removeAttribute("disabled");
            } else {
                AuthService
                    .register(email, username, password, passwordConfirmation)
                    .then(() => {
                        this.setState({
                            emailModal: <EmailModal hide={this.hideModal} email={email} type="activate your account"/>
                        });
                        this.refs.btn.removeAttribute("disabled");
                    })
                    .catch(err => {
                        this.setState({
                            showMessage: true,
                            message: err.response.data
                        });
                        this.refs.btn.removeAttribute("disabled");
                    });
            }
        }
        this.setState({ validated: true });
    }

    hideModal() {
        this.setState({
            emailModal: null
        });
        this.props.history.push('login');
    }

    render() {
        return (
            <div className="RegisterForm">
                <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmit}>
                    <Form.Group controlId="email">
                        <Form.Label>E-mail</Form.Label>
                        <Form.Control required type="email" name="email" placeholder="E-mail" onChange={this.handleChange}/>
                    </Form.Group>

                    <Form.Group controlId="username">
                        <Form.Label>Username</Form.Label>
                        <Form.Control required type="text" name="username" placeholder="Username" onChange={this.handleChange}/>
                    </Form.Group>
            
                    <Form.Group controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control required type="password" name="password" placeholder="Password" minLength="4" onChange={this.handleChange}/>
                    </Form.Group>

                    <Form.Group controlId="passwordConfirmation">
                        <Form.Label>Password confirmation</Form.Label>
                        <Form.Control required type="password" name="passwordConfirmation" placeholder="Password confirmation" minLength="4" onChange={this.handleChange}/>
                    </Form.Group>
                    
                    <Button ref="btn" variant="info" type="submit">
                        Register
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

export default RegisterForm;