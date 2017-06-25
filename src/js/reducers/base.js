import deepFreeze from 'deep-freeze';

/**
 * A helper function that performs a set of actions, such as
 * freezing the state or logging errors, before updating the
 * application's state through a provided reducer
 */

const baseReducer = (
  defaultState,
  reducer,
) => (
  (state = defaultState, action) => {
    deepFreeze(state);

    // if (action.error) {
    //   errorLogger(action);
    // }

    return reducer(state, action);
  }
);

export default baseReducer;
