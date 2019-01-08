import axios from 'axios';
import { FETCH_USER } from './types';
// All of our "action creators"
// Action creators are functions that return actions!

export const changeLogin =shouldBeLoggedIn => {
  return {
    type: 'change_auth',
    payload: shouldBeLoggedIn
  };
};


export const fetchUser = () => async dispatch => {

let response = await  axios.get('/api/current_user');

 dispatch({type: FETCH_USER, payload: response.data});
};

export const handleToken = (token) => async dispatch => {
  const response = await axios.post('/api/stripe', token);

  dispatch({type: FETCH_USER, payload: response.data});

};


export const submitSurvey = values => {
  return { type: 'submt_survey' };
};
