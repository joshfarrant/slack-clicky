import { connect } from 'react-redux';
import Component from './component.jsx';
import { THEMES } from '../../../helpers/constants';

const mapStateToProps = (state) => {
  const { theme } = state.app;
  return {
    isDarkMode: theme === THEMES.DARK,
  };
};

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Component);
