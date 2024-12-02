import axios from 'axios';

const apiBaseUrl = 'http://localhost:7000';
// const apiBaseUrl = 'http://localhost:3001';
// const apiBaseUrl = VUE_APP_API_URL; // eslint-disable-line no-undef
const client = axios.create({
  baseURL: apiBaseUrl,
  responseType: 'json',
});

export { apiBaseUrl };

export default client;
