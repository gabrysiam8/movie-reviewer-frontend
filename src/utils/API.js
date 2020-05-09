import axios from 'axios';
import AuthService from '../service/AuthService';

const fetchClient = () => {
    const defaultOptions = {
        baseURL: "http://localhost:8090/api/"
    };

    let instance = axios.create(defaultOptions);

    instance.interceptors.request.use(function (config) {
        const token = localStorage.getItem('token');
        config.headers.Authorization =  token ? token : '';
        return config;
    });

    instance.interceptors.response.use((response) => {
        return response
    }, function (error) {
        if (error.response.status === 403) {
            AuthService.logout();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    });

    return instance;
};

export default fetchClient();