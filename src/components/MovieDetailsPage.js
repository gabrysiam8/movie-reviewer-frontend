import React , {Component} from 'react';
import API from '../utils/API';
import { Spinner, Jumbotron, Table, Button, Row } from 'react-bootstrap';
import Comment from './Comment';
import NewCommentModal from './NewCommentModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

class StartPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            movie: { id: this.props.match.params.movieId },
            commentCounter: 5,
            commentModal: null
        };

        this.handleAddComment = this.handleAddComment.bind(this);
        this.hideModal = this.hideModal.bind(this);
    }

    handleAddComment(event) {
        this.setState({
            commentModal: <NewCommentModal hide={this.hideModal} movieId={this.state.movie.id}/>
        });
    }

    hideModal() {
        this.setState({
            commentModal: null
        });
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
        const { loading, movie, commentCounter } = this.state;
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
                                {this.props.isAuthenticated ?
                                <Button variant="outline-success" onClick={this.handleAddComment} className="addCommentButton">
                                    <FontAwesomeIcon icon={faPlus} color="black"/>
                                </Button>
                                :
                                null
                                }
                            </Row>
                            { movie.commentIds.slice(commentCounter*(-1)).map(commentId => <Comment key={commentId} commentId={commentId}></Comment>) }
                            </div>
                    </Jumbotron>
                }
                {this.state.commentModal}
            </div>
        );
    }
}

export default StartPage;