import React , {Component} from 'react';
import API from '../utils/API';
import { Spinner } from 'react-bootstrap';

class StartPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            movie: { id: this.props.match.params.movieId }
        };
    }

    componentDidMount() {
        this.setState({ loading: true }, () => {
            API.get('/movie/'+this.state.movie.id)
                .then(res => {
                    this.setState({ 
                        loading: false,
                        movie: res.data 
                    });
                })
                .catch(err => {
                    this.setState({ loading: false });
                });
        });
    }

    render() {
        const { loading, movie } = this.state;
        return (
            <div className="MovieDetailsPage">
                {loading ?
                    <Spinner animation="border" variant="info" />
                    :
                    <div>
                        <div className="pageTitle">
                            <h1>{movie.title}</h1>
                        </div>
                        <div>
                            <p>Genre: {movie.genre}</p>
                            <p>Year: {movie.year}</p>
                            <p>Director: {movie.director}</p>
                            <p>Rating: {movie.avgRating.toFixed(2)}</p>
                            <p>Comments</p>

                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default StartPage;