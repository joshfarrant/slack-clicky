import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import Raven from 'raven-js';
import createRavenMiddleware from 'raven-for-redux';
import persistState from 'redux-localstorage';
import deserializeStore from './deserializeStore';
import rootReducer from '../reducers';
import rootSaga from '../sagas';
import { ENVIRONMENT, SENTRY } from '../helpers/constants';

const sagaMiddleware = createSagaMiddleware();

let ravenMiddleware;
if (ENVIRONMENT.PRODUCTION) {
  Raven.config(SENTRY.DSN, {
    release: version,
  }).install();
  ravenMiddleware = createRavenMiddleware(Raven, {
    /**
     * Sentry has a limit on how much data can be
     * sent with each event. We're already sending
     * the last few actions, and if we try to
     * send the state then Sentry won't accept
     * the event as the payload is too big. We
     * could just select part of the state to
     * send, but nothing's really relevant on
     * it's own.
     */
    stateTransformer: state => state.app,
  });
}


const setUpStore = (additionalMiddleware) => {
  // eslint-disable-next-line no-underscore-dangle
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  let middleware = [
    sagaMiddleware,
    ...additionalMiddleware,
  ];

  if (ravenMiddleware) {
    middleware = [
      ...middleware,
      ravenMiddleware,
    ];
  }

  return (initialState) => {
    const store = createStore(
      rootReducer,
      initialState,
      composeEnhancers(
        applyMiddleware(...middleware),
        persistState(undefined, {
          deserialize: deserializeStore,
        }),
      ),
    );

    sagaMiddleware.run(rootSaga);

    return store;
  };
};

export default setUpStore;
