import { put, call } from 'redux-saga/effects';
import { postAuthentication, postVerifyToken, signUp } from '../../api/auth';
import * as auth from '../actions/auth';

export function* authenticationWorker(action) {
  yield put(auth.setAuthenticationStatus(true));

  try {
    let response = yield call(
      postAuthentication,
      action.payload.email,
      action.payload.password
    );

    if (response.error_status) {
      throw new Error(response.error_status);
    }

    yield localStorage.setItem('refreshToken', response.refreshToken);
    yield localStorage.setItem('username', response.email);
    yield localStorage.setItem('token', response.idToken);
    yield localStorage.setItem('localId', response.localId);
    yield put(auth.authenticationSuccess(response.email));
  } catch (err) {
    yield put(auth.authenticationFail(err.message));
    yield localStorage.removeItem('refreshToken');
    yield localStorage.removeItem('username');
    yield localStorage.removeItem('token');
    yield localStorage.removeItem('localId');
  } finally {
    yield put(auth.setAuthenticationStatus(false));
  }
}

export function* signupWorker(action) {
  yield put(auth.setSignupStatus(true));
  try {
    let response = yield call(
      signUp,
      action.payload.email,
      action.payload.password
    );

    if (response.error_status) {
      throw new Error(response.error_status);
    }

    yield localStorage.setItem('refreshToken', response.refreshToken);
    yield localStorage.setItem('username', response.email);
    yield localStorage.setItem('token', response.idToken);
    yield localStorage.setItem('localId', response.localId);
    yield put(auth.signupSuccess(response.email));
  } catch (err) {
    yield put(auth.signupFail(err.message));
    yield localStorage.removeItem('refreshToken');
    yield localStorage.removeItem('username');
    yield localStorage.removeItem('token');
    yield localStorage.removeItem('localId');
  } finally {
    yield put(auth.setSignupStatus(false));
  }
}

export function* verifyTokenWorker(action) {
  yield put(auth.tokenIsVerifying(true));

  try {
    let response = yield call(postVerifyToken, action.payload.token);
    if (!localStorage.getItem('username')) {
      throw new Error('Username misconfiguration');
    }
    yield localStorage.setItem('token', response.access_token);
    yield localStorage.setItem('refreshToken', response.refresh_token);
    yield localStorage.setItem('localId', response.user_id);

    yield put(auth.authenticationSuccess(localStorage.getItem('username')));
    yield put(auth.tokenVerifiedSuccess(response));
  } catch (err) {
    yield localStorage.removeItem('refreshToken');
    yield localStorage.removeItem('username');
    yield localStorage.removeItem('token');
    yield localStorage.removeItem('localId');
    yield put(auth.tokenVerifiedFailure());
  } finally {
    yield put(auth.tokenIsVerifying(false));
  }
}

export function* logoutWorker() {
  yield localStorage.removeItem('refreshToken');
  yield localStorage.removeItem('token');
  yield localStorage.removeItem('username');
  yield put(auth.logout());
}
