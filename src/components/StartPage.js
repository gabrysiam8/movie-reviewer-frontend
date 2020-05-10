import React , {Component} from 'react';
import API from '../utils/API';
import MovieCard from './MovieCard';
import { Spinner } from 'react-bootstrap';

class StartPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            movies: []
        };
    }

    componentDidMount() {
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

    render() {
        const { loading, movies } = this.state;
        return (
            <div className="StartPage">
                <div className="pageTitle">
                    <span className="logoPart">Discover movies</span>
                </div>
                {loading ?
                    <Spinner animation="border" variant="info" />
                    :
                    <div className="movieTable">
                        {movies.map(movie => 
                            <MovieCard key={movie.id} movie={movie} editable={false}/>
                        )}
                    </div>
                }
            </div>
        );
    }
}

export default StartPage;