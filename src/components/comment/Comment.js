import React, { Component } from 'react'
import { Toast, Button } from 'react-bootstrap';
import API from '../../utils/API';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import StarRatings from 'react-star-ratings';
import CommentModal from './CommentModal';
import AuthService from '../../service/AuthService';

export class Comment extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            comment: {},
            editable: false,
            commentModal: null
        };

        this.handleEditComment = this.handleEditComment.bind(this);
        this.handleDeleteComment = this.handleDeleteComment.bind(this);
        this.hideModal = this.hideModal.bind(this);
    }

    handleEditComment(event) {
        event.preventDefault();
        this.setState({
            commentModal: 
                <CommentModal 
                    hide={this.hideModal} 
                    comment={this.state.comment} 
                    movieId={this.props.movieId} 
                    edit={true} 
                    reloadMovie={this.props.reloadMovie}
                />
        });
    }

    handleDeleteComment(event) {
        event.preventDefault();
        API.delete('/review/'+this.props.movieId+'/comment/'+this.props.commentId)
            .then(res => {
                this.props.reloadMovie();
            })
            .catch(err => {
                console.log(err.response);
            });
    }

    hideModal() {
        this.setState({
            commentModal: null
        });
    }

    async getComment() {
        return API.get('/comment/'+this.props.commentId)
            .then(res => {
                this.setState({ 
                    comment: res.data,
                    editable: res.data.authorId === this.props.currentUserId
                });
            })
            .catch(err => {
                console.log(err.response);
            });
    }
    
    componentDidMount() {
        this.setState({ loading: true }, () => {
            this.getComment()
            .then(() => {
                API.get('/user/'+this.state.comment.authorId)
                    .then(res => {
                        this.setState({ 
                            loading: false,
                            comment: {...this.state.comment, authorUsername: res.data.username} 
                        });
                    })
                    .catch(err => {
                        this.setState({ loading: false });
                    });
                });
        });
    }

    render() {
        const { loading, comment, editable } = this.state;
        return (
            <div className="comment">
                {loading ?
                    null
                    :
                    <Toast style={{ minWidth: '80%'}}>
                    <Toast.Header closeButton={false}>
                        <FontAwesomeIcon icon={faUser} color="black" size="2x"/>
                        <strong className="mr-auto">{comment.authorUsername}</strong>
                        { AuthService.isAuthenticated() && editable ? 
                            <div className="buttonsWrapper">
                                <Button variant="outline-light" onClick={this.handleEditComment} className="commentButton">
                                    <FontAwesomeIcon icon={faPen} color="black"/>
                                </Button>
                                <Button variant="outline-light" onClick={this.handleDeleteComment} className="commentButton">
                                    <FontAwesomeIcon icon={faTrash} color="black"/>
                                </Button>
                            </div>
                        : 
                            null
                        }
                        <small>{ moment(comment.addDate).format('DD-MMM-YYYY') }</small>
                    </Toast.Header>
                    <Toast.Body>
                        <div>
                            <StarRatings
                                rating={comment.rating}
                                starRatedColor="#fff200"
                                numberOfStars={10}
                                name='rating'
                                starDimension="15px"
                                starSpacing="2px"
                            />
                        </div>
                        {comment.text}
                    </Toast.Body>
                    </Toast>
                }
                {this.state.commentModal}
            </div>
        )
    }
}

export default Comment;