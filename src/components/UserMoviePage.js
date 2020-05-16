import React , { Component } from 'react';
import API from '../utils/API';
import MovieCard from './movie/MovieCard';
import { Spinner, Button } from 'react-bootstrap';
import MovieModal from './movie/MovieModal';

class UserMoviePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            movies: [],
            movieModal: null
        };

        this.showAddModal = this.showAddModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.loadMovies = this.loadMovies.bind(this);
    }

    showAddModal(event) {
        event.preventDefault();
        this.setState({
            movieModal: <MovieModal hide={this.hideModal} edit={false} reloadMovies={this.loadMovies}/>
        });
    }

    hideModal() {
        this.setState({
            movieModal: null
        });
    }

    loadMovies() {
        this.setState({ loading: true }, () => {
            API.get('/movie')
                .then(res => {
                    this.setState({ 
                        loading: false,
                        movies: res.data 
                    });
                })
                .catch(err => {
                    this.setState({ loading: false });
                });
        });
    }

    componentDidMount() {
        this.loadMovies();
    }

    render() {
        const { loading, movies } = this.state;
        return (
            <div className="UserMoviePage">
                <div className="pageTitle">
                    <span className="logoPart">Your movies</span>
                </div>
                {loading ?
                    <Spinner animation="border" variant="info" />
                    :
                    <div className="movieTable">
                        {movies.map(movie => 
                            <MovieCard key={movie.id} movie={movie} editable={true} reloadMovies={this.loadMovies}/>
                        )}
                    </div>
                }
                <Button 
                    className="addMovieButton" 
                    variant="success"
                    size="lg"
                    onClick={this.showAddModal}
                >
                    Add movie
                </Button>
                {this.state.movieModal}
            </div>
        );
    }
}

export default UserMoviePage;