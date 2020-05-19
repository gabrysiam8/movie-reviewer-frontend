import React, { Component } from 'react';
import API from '../../utils/API';
import qs from 'qs';
import { Alert, Spinner } from 'react-bootstrap';

export class AccountVerificationPage extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            loading: true,
            confirmed: "",
            message: ""
        };

    }

    componentDidMount() {
        const query = qs.parse(this.props.location.search, {
            ignoreQueryPrefix: true
        });
        
        if(query.token) {
            this.setState({ loading: true }, () => {
                API.get('/auth/confirmation?token='+query.token)
                    .then(res => {
                        this.setState({
                            loading: false,
                            confirmed: true,
                            message: res.data
                        });
                    })
                    .catch(err => {
                        this.setState({
                            loading: false,
                            confirmed: false,
                            message: err.response.data
                        });
                    });
              });
        }
    }

    render() {
        var alert = this.state.confirmed ?
        <Alert variant="success">
            <Alert.Heading>Account was successfully verified!</Alert.Heading>
            <p>To log in to the application click <Alert.Link href="/login">here</Alert.Link>.</p>
        </Alert>
        :
        <Alert variant="danger">
            <Alert.Heading>Failed to verify e-mail address!</Alert.Heading>
            <p>{this.state.message}</p>
        </Alert>;

        return (
            <div className="AccountConfirmationPage">
                {this.state.loading ?
                    <Spinner animation="border" variant="info" />
                    :
                    alert
                }
            </div>
        )
    }
}

export default AccountVerificationPage;