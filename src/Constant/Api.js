import axios from 'axios';

const Api = axios.create({
  baseURL: 'https://stgapi-bnpl.tarality.io/api/v2/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default Api;
