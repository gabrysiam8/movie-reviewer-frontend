import React, { Component } from 'react'
import { Card, Button} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm } from '@fortawesome/free-solid-svg-icons';
import StarRatings from 'react-star-ratings';
import { withRouter } from 'react-router-dom';

export class MovieCard extends Component {

    constructor(props) {
        super(props);

        this.routeChange = this.routeChange.bind(this);
    }
    
    routeChange() {
        this.props.history.push("/movie/"+this.props.movie.id);
    }

    render() {
        return (
            <div className="movieCardWrapper">
            <Card className="movieCard">
                <FontAwesomeIcon icon={faFilm} size="6x" />
                <Card.Body>
                    <Card.Title>{this.props.movie.title}</Card.Title>
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
                        <Button variant="info" onClick={(e) => this.props.onUpdate(e, this.props.movie.id)}>Edit</Button> 
                        <Button variant="danger" onClick={(e) => this.props.onDelete(e, this.props.movie.id)}>Delete</Button> 
                    </div>
                    :
                    <div className="buttonsWrapper">
                        <Button variant="info"  onClick={this.routeChange}>Get more info...</Button>
                    </div>
                }
            </Card>
            </div>
        )
    }
}

export default withRouter(MovieCard);