/**
 * Shorthand convenience function for building actions
 * Structured based on Flux Standard Actions
 * https://github.com/acdlite/flux-standard-action
 */

const actionCreator = (
  type,
  payload,
  error = false,
) => ({
  type,
  payload,
  error,
});

export default actionCreator;
