import React, { Component } from 'react'
import { Modal, Form, Button } from 'react-bootstrap';
import API from '../utils/API';

export class NewCommentModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rating: 1,
            text: "",
            validated: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleAddComment = this.handleAddComment.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleAddComment(event) {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
          event.stopPropagation();
        } else {
            this.refs.btn.setAttribute("disabled", "disabled"); 
            const { rating, text } = this.state;
            API
                .post("/movie/"+this.props.movieId+"/comment", { rating, text })
                .then(res => {
                    // this.props.hide();
                    window.location.reload(false);
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

    render() {
        return (
        <Modal className="centerPopup" show={true} onHide={this.props.hide}>
            <Modal.Header closeButton>
                <Modal.Title>New comment</Modal.Title>
            </Modal.Header>
            <Form onSubmit={this.handleAddComment}>
                <Modal.Body>
                    <Form.Group controlId="rating">
                        <Form.Label>Rating</Form.Label>
                        <Form.Control as="select" name="rating" onChange={this.handleChange}>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                        <option>6</option>
                        <option>7</option>
                        <option>8</option>
                        <option>9</option>
                        <option>10</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="text">
                        <Form.Label>Comment</Form.Label>
                        <Form.Control as="textarea" rows="3" name="text" onChange={this.handleChange}/>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button ref="btn" variant="success" type="submit">Add</Button>
                </Modal.Footer>
            </Form>
        </Modal>
        );
    }
}

export default NewCommentModal;