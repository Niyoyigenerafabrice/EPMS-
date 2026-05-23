import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api/stock-out',
  withCredentials: true
});

export const addStockOut = (data) => API.post('/', data);
export const getStockOut = () => API.get('/');
export const updateStockOut = (id, data) => API.put(`/${id}`, data);
export const deleteStockOut = (id) => API.delete(`/${id}`);
