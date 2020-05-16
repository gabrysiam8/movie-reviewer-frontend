import React, { Component } from 'react'
import { Modal, Form, Button } from 'react-bootstrap';
import API from '../../utils/API';

export class CommentModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            comment: props.edit ? props.comment : { rating: 1, text: "" },
            validated: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAddComment = this.handleAddComment.bind(this);
        this.handleEditComment = this.handleEditComment.bind(this);
    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        this.setState(prevState => ({
            comment: {                   
                ...prevState.comment,    
                [name]: value     
            }
        }));
    }
    handleSubmit(event) {
        if(this.props.edit) {
            this.handleEditComment(event);
        }
        else {
            this.handleAddComment(event);
        }
    }

    handleAddComment(event) {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
          event.stopPropagation();
        } else {
            const { comment } = this.state;
            API
                .post("/review/"+this.props.movieId, comment)
                .then(res => {
                    window.location.reload(false);
                })
                .catch(err => {
                    console.log(err.response);
                });
        }
        this.setState({ validated: true });
    }

    handleEditComment(event) {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
          event.stopPropagation();
        } else {
            const { comment } = this.state;
            API
                .put("/review/"+this.props.movieId+"/comment/"+comment.id, comment)
                .then(res => {
                    this.props.reloadMovie();
                    this.props.hide();
                })
                .catch(err => {
                    console.log(err.response);
                });
        }
        this.setState({ validated: true });
    }

    render() {
        const { comment } = this.state;
        return (
        <Modal className="centerPopup" show={true} onHide={this.props.hide}>
            <Modal.Header closeButton>
                <Modal.Title>New comment</Modal.Title>
            </Modal.Header>
            <Form onSubmit={this.handleSubmit}>
                <Modal.Body>
                    <Form.Group controlId="rating">
                        <Form.Label>Rating</Form.Label>
                        <Form.Control as="select" name="rating" onChange={this.handleChange} value={comment.rating}>
                            { Array.from(new Array(10), (val, index) => <option> {index+1} </option>) }
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="text">
                        <Form.Label>Comment</Form.Label>
                        <Form.Control as="textarea" rows="3" name="text" onChange={this.handleChange} value={comment.text}/>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                     <Button ref="btn" variant="success" type="submit">{this.props.edit ? "Edit": "Add"}</Button>
                </Modal.Footer>
            </Form>
        </Modal>
        );
    }
}

export default CommentModal;