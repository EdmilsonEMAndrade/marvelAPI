import axios from 'axios';

const urlMarvel = axios.create({
    baseURL: 'https://gateway.marvel.com/v1/public',
});
export default urlMarvel;
