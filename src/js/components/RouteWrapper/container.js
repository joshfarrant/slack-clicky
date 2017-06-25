import { connect } from 'react-redux';
import Component from './component.jsx';

const mapStateToProps = (state) => {
  const { theme } = state.app;
  return {
    theme,
  };
};

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Component);
