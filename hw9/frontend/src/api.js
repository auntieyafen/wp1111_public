import axios from 'axios';

const instance = axios.create({
  baseURL: `/`,
});

export default instance;

// instance.get('/hi').then((data) => console.log(data));
