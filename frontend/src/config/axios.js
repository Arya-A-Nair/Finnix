import axios from 'axios';
const instance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_API_DOMAIN || "http://localhost:3000",
});

export default instance;