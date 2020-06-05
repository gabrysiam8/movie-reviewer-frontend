import React , {Component} from 'react';
import API from '../../utils/API';
import { Spinner, Jumbotron, Table } from 'react-bootstrap';
import AuthService from '../../service/AuthService';
import CommentList from '../comment/CommentList';

class MovieDetailsPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            currentUserId: "",
            movie: { id: props.match.params.movieId }
        };

        this.loadCurrentUser = this.loadCurrentUser.bind(this);
        this.loadMovie = this.loadMovie.bind(this);
    }

    loadCurrentUser() {
        if(this.props.isAuthenticated && this.state.currentUserId==="") {
            AuthService
                .getCurrentUser()
                .then(res => {
                    this.setState({
                        currentUserId: res.data.id
                    });
                })
                .catch(err => {
                    console.log(err.response.data);
                });
        }
    }

    loadMovie() {
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
    }

    componentDidUpdate() {
        this.loadCurrentUser();
    }

    componentDidMount() {
        this.setState({ loading: true }, () => {
            this.loadCurrentUser();
            this.loadMovie();
        });
    }

    render() {
        const { loading, movie } = this.state;
        
        return (
            <div className="MovieDetailsPage">
                {loading ?
                    <Spinner animation="border" variant="info" />
                    :
                    <Jumbotron>
                        <div className="pageTitle">
                            {movie.title}
                        </div>
                        <div className="movieDetailsWrapper">
                        <Table hover>
                            <tbody>
                                <tr>
                                    <th>Genre</th>
                                    <td>{movie.genre}</td>
                                </tr>
                                <tr>
                                    <th>Year</th>
                                    <td>{movie.year}</td>
                                </tr>
                                <tr>
                                    <th>Director</th>
                                    <td>{movie.director}</td>
                                </tr>
                                <tr>
                                    <th>Rating</th>
                                    <td>{movie.avgRating.toFixed(2)}</td>
                                </tr>
                            </tbody>
                            </Table>
                            </div>
                            <CommentList 
                                currentUserId={this.state.currentUserId} 
                                commentIds={this.state.movie.commentIds} 
                                movieId={this.state.movie.id}
                                canComment={this.state.movie.canComment}
                            />
                    </Jumbotron>
                }
            </div>
        );
    }
}

export default MovieDetailsPage;