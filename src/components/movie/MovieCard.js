import React, { Component } from 'react'
import { Card, Button, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm } from '@fortawesome/free-solid-svg-icons';
import StarRatings from 'react-star-ratings';
import { withRouter } from 'react-router-dom';
import API from '../../utils/API';
import MovieModal from './MovieModal';

export class MovieCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            movieModal: null
        };

        this.handleEditMovie = this.handleEditMovie.bind(this);
        this.handleDeleteMovie = this.handleDeleteMovie.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.handleShowDetails = this.handleShowDetails.bind(this);
    }
    
    handleEditMovie(event) {
        event.preventDefault();
        this.setState({
            movieModal: <MovieModal hide={this.hideModal} movie={this.props.movie} edit={true} reloadMovies={this.props.reloadMovies}/>
        });
    }

    handleDeleteMovie(event) {
        event.preventDefault();
        API.delete('/movie/'+this.props.movie.id)
            .then(res => {
                this.props.reloadMovies();
            })
            .catch(err => {
                console.log(err.response);
            });
    }

    hideModal() {
        this.setState({
            movieModal: null
        });
    }

    handleShowDetails() {
        this.props.history.push("/movie/"+this.props.movie.id);
    }

    render() {
        return (
            <div className="movieCardWrapper">
            <Card className="movieCard">
                <FontAwesomeIcon icon={faFilm} size="6x" />
                <Card.Body>
                    <h2><Badge variant="dark">{this.props.movie.title}</Badge></h2>
                    <p>{this.props.movie.genre}</p>
                    <StarRatings
                        rating={this.props.movie.avgRating}
                        starRatedColor="#fff200"
                        numberOfStars={10}
                        name='rating'
                        starDimension="20px"
                        starSpacing="5px"
                    />
                    <p>{this.props.movie.avgRating.toFixed(2)}</p>
                </Card.Body>
                {this.props.editable ?
                    <div className="buttonsWrapper">
                        <Button variant="outline-info" onClick={this.handleEditMovie} className="movieButton">Edit</Button> 
                        <Button variant="outline-danger" onClick={this.handleDeleteMovie} className="movieButton">Delete</Button> 
                    </div>
                    :
                    <div className="buttonsWrapper">
                        <Button variant="outline-info"  onClick={this.handleShowDetails}>Get more info...</Button>
                    </div>
                }
            </Card>
            {this.state.movieModal}
            </div>
        )
    }
}

export default withRouter(MovieCard);