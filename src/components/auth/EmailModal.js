import React, { Component } from 'react';
import { Form, Button, Modal, Alert } from 'react-bootstrap';
import API from '../../utils/API';

export class EmailModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: props.email,
            showMessage: false,
            message: "",
            validated: false,
            confirmation: props.type
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSendResetEmail = this.handleSendResetEmail.bind(this);
        this.renderBody = this.renderBody.bind(this)
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSendResetEmail(event) {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
          event.stopPropagation();
        } else {
            this.refs.btn.setAttribute("disabled", "disabled"); 
            const { email } = this.state;
            API
                .get("/auth/resetPassword?email="+email)
                .then(res => {
                    this.setState({
                        showMessage: false,
                        confirmation: "reset your password"
                    });
                })
                .catch(err => {
                    this.setState({
                        showMessage: true,
                        message: err.response.data
                    });
                    this.refs.btn.removeAttribute("disabled");
                });
        }
        this.setState({ validated: true });
    }

    renderBody() {
        if(this.state.confirmation==="") {
            return <Form noValidate validated={this.state.validated} onSubmit={this.handleSendResetEmail} >
                        <Form.Group controlId="email">
                            <Form.Control required type="email" name="email" placeholder="E-mail" onChange={this.handleChange}/>
                        </Form.Group>
                        
                        <Button ref="btn" variant="info" type="submit">
                            Reset password
                        </Button>
                    </Form>
        }
        return <p>An email was sent to: {this.state.email}.
                Open this email and click the link to {this.state.confirmation}.</p>
    }

    render() {
        return (
            <div >
                <Modal className="centerPopup" show={true} onHide={this.props.hide}>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.state.confirmation==="" ? 'Enter e-mail' : 'Almost done...'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body >
                        {this.renderBody()}
                    </Modal.Body>
                    {this.state.showMessage ? 
                        <Alert className="dangerAlert" variant="danger">
                            <p>{this.state.message}</p>
                        </Alert>
                        :
                        null
                    }
                </Modal>
            </div>
        )
    }
}

export default EmailModal;