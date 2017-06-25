import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Store } from 'react-chrome-redux';
import Root from './components/Root';
import { REACT_CHROME_REDUX } from './helpers/constants';

const store = new Store({
  portName: REACT_CHROME_REDUX.PORT_NAME,
});

store.ready().then(() => {
  render(
    <Provider store={store}>
      <Root />
    </Provider>,
    document.getElementById('root'),
  );
});
