import React, { Component } from 'react'
import { Toast } from 'react-bootstrap';
import API from '../utils/API';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import StarRatings from 'react-star-ratings';

export class Comment extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            comment: {}
        };
    }

    async getComment() {
        return API.get('/comment/'+this.props.commentId)
            .then(res => {
                this.setState({ 
                    comment: res.data 
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
        const { comment } = this.state;
        return (
            <div className="comment">
                <Toast style={{ minWidth: '80%'}}>
                <Toast.Header closeButton={false}>
                    <FontAwesomeIcon icon={faUser} color="black" size="2x"/>
                    <strong className="mr-auto">{comment.authorUsername}</strong>
                    <small>{moment(comment.addDate).format('DD-MMM-YYYY')}</small>
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
            </div>
        )
    }
}

export default Comment;