import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api/stock-in',
  withCredentials: true
});

export const addStockIn = (data) => API.post('/', data);
export const getStockIn = () => API.get('/');
