import Axios from 'axios';

const client = Axios.create({
  baseURL: process.env.SPLATOON_STATS_API_URL,
  responseType: 'json',
});

export default client;
