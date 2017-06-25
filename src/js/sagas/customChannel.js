import { channel } from 'redux-saga';
import { put, take } from 'redux-saga/effects';

/**
 * A useful custom channel for 'putting' actions
 * from within an external library's callback.
 * Solution from Andarist on GitHub:
 * https://github.com/redux-saga/redux-saga/issues/475#issuecomment-239129811
 */

export const customChannel = channel();

export default function* watchCustomChannel() {
  while (true) { // eslint-disable-line no-constant-condition
    const action = yield take(customChannel);
    yield put(action);
  }
}
