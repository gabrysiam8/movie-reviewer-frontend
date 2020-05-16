import React, { Component } from 'react'
import { Modal, Form, Button } from 'react-bootstrap';
import API from '../../utils/API';

export class MovieModal extends Component {
    constructor(props) {
        super(props);

        this.year = new Date().getFullYear();
        this.state = {
            movie: props.edit ? props.movie : { year: this.year },
            validated: false
        };


        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAddMovie = this.handleAddMovie.bind(this);
        this.handleEditMovie = this.handleEditMovie.bind(this);
    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        this.setState(prevState => ({
            movie: {                   
                ...prevState.movie,    
                [name]: value     
            }
        }));
    }

    handleSubmit(event) {
        if(this.props.edit) {
            this.handleEditMovie(event);
        }
        else {
            this.handleAddMovie(event);
        }
    }

    handleAddMovie(event) {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
          event.stopPropagation();
        } else {
            this.refs.btn.setAttribute("disabled", "disabled"); 
            const { movie } = this.state;
            API
                .post('/movie', movie)
                .then(res => {
                    this.props.reloadMovies();
                    this.props.hide();
                })
                .catch(err => {
                    console.log(err.response);
                    this.refs.btn.removeAttribute("disabled");
                });
        }
        this.setState({ validated: true });
    }

    handleEditMovie(event) {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
          event.stopPropagation();
        } else {
            this.refs.btn.setAttribute("disabled", "disabled"); 
            const { movie } = this.state;
            API
                .put("/movie/" + movie.id, movie)
                .then(res => {
                    this.props.reloadMovies();
                    this.props.hide();
                })
                .catch(err => {
                    console.log(err.response);
                    this.refs.btn.removeAttribute("disabled");
                });
        }
        this.setState({ validated: true });
    }

    render() {
        const { movie } = this.state;
        return (
        <Modal className="centerPopup" show={true} onHide={this.props.hide}>
            <Modal.Header closeButton>
                <Modal.Title>New movie</Modal.Title>
            </Modal.Header>
            <Form onSubmit={this.handleSubmit}>
                <Modal.Body>
                    <Form.Group controlId="title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control name="title" onChange={this.handleChange} value={movie.title} required/>
                    </Form.Group>
                    <Form.Group controlId="genre">
                        <Form.Label>Genre</Form.Label>
                        <Form.Control name="genre" onChange={this.handleChange} value={movie.genre} required/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Year</Form.Label>
                        <Form.Control as="select" name="year" onChange={this.handleChange} value={movie.year} required>
                            { Array.from(new Array(100), (val, index) => <option> {this.year-index} </option>) }
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="director">
                        <Form.Label>Director</Form.Label>
                        <Form.Control name="director" onChange={this.handleChange} value={movie.director} required/>
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

export default MovieModal;