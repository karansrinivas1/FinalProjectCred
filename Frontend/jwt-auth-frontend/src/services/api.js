import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/', // Replace with your backend URL
});

// Automatically add the token to requests if it exists
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        console.log('Request:', config); // Log request details
        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Log responses for debugging
api.interceptors.response.use(
    (response) => {
        console.log('Response:', response); // Log response details
        return response;
    },
    (error) => {
        console.error('Response Error:', error.response || error);
        return Promise.reject(error);
    }
);

export default api;
