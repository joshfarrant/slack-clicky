import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import persistState from 'redux-localstorage';
import deserializeStore from './deserializeStore';
import rootReducer from '../reducers';
import rootSaga from '../sagas';

const sagaMiddleware = createSagaMiddleware();

const setUpStore = (additionalMiddleware) => {
  // eslint-disable-next-line no-underscore-dangle
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const middleware = [
    sagaMiddleware,
    ...additionalMiddleware,
  ];

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
