import { connect } from 'react-redux';
import Component from './component.jsx';
import { app as appActions } from '../../actions';

const { theme } = appActions;

const mapStateToProps = (state) => {
  const { themeColor } = state.app;
  return {
    themeColor,
  };
};

const mapDispatchToProps = dispatch => ({
  setThemeColor: (color) => {
    dispatch(theme.setColor({ color }));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Component);
