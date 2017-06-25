import { all } from 'redux-saga/effects';
import watchCustomChannel from './customChannel';
import watchNotificationsActions from './notifications';
import watchTeamsActions from './teams';

export default function* root() {
  yield all([
    watchCustomChannel(),
    watchNotificationsActions(),
    watchTeamsActions(),
  ]);
}
