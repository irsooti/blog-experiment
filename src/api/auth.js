import axios from 'axios';
import { FIREBASE_API_KEY } from '../const/api';

export const authenticate = (email, password) => {
  return axios
    .post(
      'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=' +
        FIREBASE_API_KEY,
      { email, password, returnSecureToken: true }
    )
    .then(({ data }) => {
      return data;
    })
    .catch(err => {
      console.warn('Firebase auth failed', err);
    });
};