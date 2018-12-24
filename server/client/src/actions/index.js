import axios from 'axios';
import { FETCH_USER } FROM './types';

const fetchUser =() => {

  axios.get('/api/current_user');

};
