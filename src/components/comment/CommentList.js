import React, { Component } from 'react'
import { Button, Row, Spinner } from 'react-bootstrap';
import Comment from './Comment';
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
            commentModal: <CommentModal hide={this.hideModal} movieId={this.props.movieId} edit={false} reloadMovie={this.props.reloadMovie}/>
        });
    }

    hideModal() {
        this.setState({
            commentModal: null
        });
    }

    async getComments() {
        return Promise.all(this.props.commentIds
            .slice()
            .reverse()
            .map(commentId => 
                <Comment 
                    key={commentId} 
                    currentUserId={this.props.currentUserId} 
                    commentId={commentId} 
                    movieId={this.props.movieId}
                    reloadMovie={this.props.reloadMovie}
                />
            ));
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
                    {comments}
                    </div>
                }
                {commentModal}
            </div>
        );
    }
}

export default CommentList;