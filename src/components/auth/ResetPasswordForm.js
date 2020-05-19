import React, { Component } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import API from "../../utils/API";
import qs from 'qs';

export class ResetPasswordForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userId: "",
            newPassword: "",
            passwordConfirmation: "",
            showForm: false,
            validated: false,
            showMessage: false,
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
            const { userId, newPassword, passwordConfirmation } = this.state;

            if(newPassword !== passwordConfirmation) {
                this.setState({
                    showMessage: true,
                    message: "The Password confirmation must match New password!",
                    alertVariant: "danger"
                });
                this.refs.btn.removeAttribute("disabled");
            } else {
                API.put("/user/"+userId+"/password", { newPassword, passwordConfirmation })
                    .then((res) => {
                        this.setState({
                            message: "Password was successfully reset!",
                            showMessage: true,
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

    componentDidMount() {
        const query = qs.parse(this.props.location.search, {
            ignoreQueryPrefix: true
        });
        console.log(query.token)
        API.get("/confirmation?token="+query.token)
            .then((res) => {
                this.setState({ 
                    userId: res.data.user.id,
                    showForm: true 
                });
            })
            .catch(err => {
                this.setState({
                    showMessage: true,
                    message: err.response.data,
                    alertVariant: "danger"
                });
            });
    }

    render() {
        return (
            <div className="ChangePasswordForm">
                {this.state.showForm ?
                    <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmit}>
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
                :
                    null
                }
                {this.state.showMessage ? 
                    <Alert className="dangerAlert" variant={this.state.alertVariant}>
                        <Alert.Heading>{this.state.showForm ? null: "Cannot reset password!"}</Alert.Heading>
                        <p>{this.state.message}</p>
                        {this.state.alertVariant==="success" ? <a href="/login">Click here to log in</a> : null}
                    </Alert>
                    :
                    null
                }
            </div>
        );
    }
}

export default ResetPasswordForm;