import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://streamvibe-server.onrender.com/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
