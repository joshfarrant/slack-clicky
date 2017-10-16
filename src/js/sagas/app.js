import { all, put, takeEvery } from 'redux-saga/effects';
import { app as appActions } from '../actions';
import { getActiveTabUrl } from '../helpers/utils';

const {
  GET_CURRENT_TAB_URL,
  currentTabUrl,
} = appActions;


function* getCurrentTabUrl() {
  const url = yield getActiveTabUrl();
  yield put(currentTabUrl.got({ currentTabUrl: url }));
}

export default function* watchAppActions() {
  yield all([
    takeEvery(GET_CURRENT_TAB_URL, getCurrentTabUrl),
  ]);
}
