import React, { Component } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import API from "../../utils/API";

class ChangePasswordForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            oldPassword: "",
            newPassword: "",
            passwordConfirmation: "",
            validated: false,
            showMessage: false,
            alertVariant: "",
            message: ""
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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

            const { oldPassword, newPassword, passwordConfirmation } = this.state;

            if(newPassword !== passwordConfirmation) {
                this.setState({
                    showMessage: true,
                    message: "The Password confirmation must match New password!",
                    alertVariant: "danger"
                });
                this.refs.btn.removeAttribute("disabled");
            } else {
                API.put("/user/me/password", { oldPassword, newPassword, passwordConfirmation })
                    .then((res) => {
                        this.setState({
                            showMessage: true,
                            message: res.data,
                            alertVariant: "success"
                        });
                    })
                    .catch(err => {
                        this.setState({
                            showMessage: true,
                            message: err.response.data,
                            alertVariant: "danger"
                        });
                        this.refs.btn.removeAttribute("disabled");
                    });
            }
        }
        this.setState({ validated: true });
    }

    render() {
        return (
            <div className="ChangePasswordForm">
                <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmit}>
                    <Form.Group controlId="oldPassword">
                        <Form.Label>Old password</Form.Label>
                        <Form.Control required type="password" name="oldPassword" placeholder="Old password" onChange={this.handleChange}/>
                    </Form.Group>

                    <Form.Group controlId="password">
                        <Form.Label>New password</Form.Label>
                        <Form.Control required type="password" name="newPassword" placeholder="New password" minLength="4" onChange={this.handleChange}/>
                    </Form.Group>
            
                    <Form.Group controlId="passwordConfirmation">
                        <Form.Label>Password confirmation</Form.Label>
                        <Form.Control required type="password" name="passwordConfirmation" placeholder="Password confirmation" minLength="4" onChange={this.handleChange}/>
                    </Form.Group>

                    <Button ref="btn" variant="info" type="submit">
                        Change password
                    </Button>
                </Form>
                {this.state.showMessage ? 
                    <Alert className="dangerAlert" variant={this.state.alertVariant}>
                        <p>{this.state.message}</p>
                    </Alert>
                    :
                    null
                }
            </div>
        );
    }
}

export default ChangePasswordForm;