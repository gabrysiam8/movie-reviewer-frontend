import React , {Component} from 'react';
import API from '../../utils/API';
import { Spinner, Jumbotron, Table, Button, Row } from 'react-bootstrap';
import Comment from '../comment/Comment';
import CommentModal from '../comment/CommentModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import AuthService from '../../service/AuthService';

class MovieDetailsPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            currentUserId: "",
            movie: { id: props.match.params.movieId },
            commentCounter: 5,
            commentModal: null
        };

        this.handleAddComment = this.handleAddComment.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.loadCurrentUser = this.loadCurrentUser.bind(this);
        this.loadMovie = this.loadMovie.bind(this);
    }

    handleAddComment(event) {
        event.preventDefault();
        this.setState({
            commentModal: <CommentModal hide={this.hideModal} movieId={this.state.movie.id} edit={false} />
        });
    }

    hideModal() {
        this.setState({
            commentModal: null
        });
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
        const { loading, currentUserId, movie, commentModal } = this.state;
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
                            <div className="commentsWrapper">
                            <Row >
                                <h2 className="commentHeader">COMMENTS</h2>
                                { movie.canComment ?
                                    <Button variant="outline-success" onClick={this.handleAddComment} className="addCommentButton">
                                        <FontAwesomeIcon icon={faPlus} color="black"/>
                                    </Button>
                                    :
                                    null
                                }
                            </Row>
                            { movie.commentIds
                                .slice()
                                .reverse()
                                .map(commentId => 
                                    <Comment 
                                        key={commentId} 
                                        currentUserId={currentUserId} 
                                        commentId={commentId} 
                                        movieId={movie.id}
                                        reloadMovie={this.loadMovie}
                                    />
                                ) 
                            }
                            </div>
                    </Jumbotron>
                }
                {commentModal}
            </div>
        );
    }
}

export default MovieDetailsPage;