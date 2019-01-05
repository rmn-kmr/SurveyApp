import axios from 'axios';
import { FETCH_USER } from './types';

export const fetchUser = () => async dispatch => {
  console.log("api called");
const res = await  axios.get('/api/current_user');
console.log(res);
 dispatch({type: FETCH_USER, payload: res.data});
};
