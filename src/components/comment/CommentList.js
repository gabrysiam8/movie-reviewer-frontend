import React, { Component } from 'react'
import { Button, Row, Spinner } from 'react-bootstrap';
import Comment from './Comment';
import API from '../../utils/API';
import CommentModal from './CommentModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export class CommentList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            comments: null,
            commentModal: null
        };

        this.handleAddComment = this.handleAddComment.bind(this);
        this.hideModal = this.hideModal.bind(this);
    }


    handleAddComment(event) {
        event.preventDefault();
        this.setState({
            commentModal: <CommentModal hide={this.hideModal} movieId={this.props.movieId} edit={false}/>
        });
    }

    hideModal() {
        this.setState({
            commentModal: null
        });
    }

    async getCommentsWithoutUser() {
        return API.get('/review/'+this.props.movieId)
            .then(res => {
                return res.data;
            })
            .catch(err => {
                this.setState({ loading: false });
            });
    }

    async getUser(userId) {
        return API.get('/user/'+userId)
            .then(res => {
                return res.data.username;
            })
            .catch(err => {
                this.setState({ loading: false });
            });
            
    }

    async getComments() {
        return this.getCommentsWithoutUser().then(res =>{
            return Promise.all(
                res.slice()
                    .reverse()
                    .map(comment => {
                        return this.getUser(comment.authorId).then(username => {
                            return {
                                ...comment,
                                editable: comment.authorId === this.props.currentUserId,
                                authorUsername: username
                            };
                        });
                        
                    })
            );
        });
    }

    componentDidMount() {
        this.getComments().then(res => {
            this.setState({ 
                comments: res,
                loading: false
            });
        })
    }

    render() {
        const { loading, comments, commentModal } = this.state;
        return (
            <div className="commentsWrapper">
                {loading ?
                    <Spinner animation="border" variant="info" />
                    :
                    <div>
                    <Row >
                        <h2 className="commentHeader">COMMENTS</h2>
                        { this.props.canComment ?
                            <Button variant="outline-success" onClick={this.handleAddComment} className="addCommentButton">
                                <FontAwesomeIcon icon={faPlus} color="black"/>
                            </Button>
                            :
                            null
                        }
                    </Row>
                    {comments.map(comment =>
                        <Comment 
                            key={comment.id} 
                            currentUserId={this.props.currentUserId} 
                            comment={comment} 
                            movieId={this.props.movieId}
                        />
                    )}
                    </div>
                }
                {commentModal}
            </div>
        );
    }
}

export default CommentList;