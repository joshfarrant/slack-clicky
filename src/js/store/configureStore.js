import devConfigureStore from './configureStore.dev';
import prodConfigureStore from './configureStore.prod';
import { ENVIRONMENT } from '../helpers/constants';

let exportedStore;

if (ENVIRONMENT.PRODUCTION) {
  exportedStore = prodConfigureStore;
} else {
  exportedStore = devConfigureStore;
}

export default exportedStore;
