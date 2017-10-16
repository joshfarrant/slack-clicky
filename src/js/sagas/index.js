import { all } from 'redux-saga/effects';
import watchAppActions from './app';
import watchCustomChannel from './customChannel';
import watchNotificationsActions from './notifications';
import watchTeamsActions from './teams';

export default function* root() {
  yield all([
    watchAppActions(),
    watchCustomChannel(),
    watchNotificationsActions(),
    watchTeamsActions(),
  ]);
}
