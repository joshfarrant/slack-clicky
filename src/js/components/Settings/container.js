import { connect } from 'react-redux';
import Component from './component.jsx';
import {
  app as appActions,
  state as stateActions,
} from '../../actions';

const { section, theme } = appActions;

const mapStateToProps = (state) => {
  const { theme: appTheme, visibleSections } = state.app;
  return {
    theme: appTheme,
    visibleSections,
  };
};

const mapDispatchToProps = dispatch => ({
  clearState: () => {
    dispatch(stateActions.clear());
  },
  hideSection: (sectionName) => {
    dispatch(section.hide({ section: sectionName }));
  },
  setTheme: (themeName) => {
    dispatch(theme.set({ theme: themeName }));
  },
  showSection: (sectionName) => {
    dispatch(section.show({ section: sectionName }));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Component);
