import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api/spare-parts',
  withCredentials: true
});

export const addSparePart = (data) => API.post('/', data);
export const getSpareParts = () => API.get('/');
