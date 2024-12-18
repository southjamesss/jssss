import axios from 'axios';

const API_URL = 'http://localhost:3000'; // URL ของ backend

export const register = async (email, password) => {
  return axios.post(`${API_URL}/register`, { email, password });
};

export const login = async (email, password) => {
  return axios.post(`${API_URL}/login`, { email, password });
};