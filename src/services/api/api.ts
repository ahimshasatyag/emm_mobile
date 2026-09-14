import axios from 'axios';

// Konfigurasi dasar untuk Axios
export const api = axios.create({
    baseURL: 'http://192.168.1.101:8001/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

export default api;
