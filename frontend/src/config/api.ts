import axios from 'axios';

// Production API URL
const API_URL = import.meta.env.VITE_API_URL || 'https://talkit-b.onrender.com/api';

const api = axios.create({
  baseURL: API_URL
});

export default api;
