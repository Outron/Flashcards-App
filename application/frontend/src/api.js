import axios from 'axios';

const api = axios.create({
    baseURL: 'http://api-service:8000'
});

export default api;