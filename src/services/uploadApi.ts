import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

const uploadApi = axios.create({
  baseURL: baseURL,
});

uploadApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default uploadApi;