import { createLogger } from 'redux-logger';
import setUpStore from './store';

const middleware = [
  createLogger({
    duration: true,
  }),
];

export default setUpStore(middleware);
