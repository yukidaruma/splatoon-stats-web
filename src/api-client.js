import axios from 'axios';

const apiBaseUrl = 'http://localhost:3000';
const client = axios.create({
  baseURL: apiBaseUrl,
  responseType: 'json',
});

export default client;