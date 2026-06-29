import axios from 'axios';

// Konfigurasi dasar untuk Axios (cocok untuk Laravel Sanctum SPA)
export const api = axios.create({
    // Ganti dengan IP lokal backend Laravel Anda jika menggunakan HP fisik
    // Contoh: 'http://192.168.1.100:8000/api'
    baseURL: 'http://localhost:8000/api', 
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true, // Penting untuk mengizinkan Sanctum Session Cookies
});

export default api;
