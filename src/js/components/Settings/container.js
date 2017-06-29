import { connect } from 'react-redux';
import Component from './component.jsx';
import {
  app as appActions,
  state as stateActions,
  notifications as notificationsActions,
} from '../../actions';

const { section, theme } = appActions;

const { notifications } = notificationsActions;

const mapStateToProps = (state) => {
  const { theme: appTheme, visibleSections } = state.app;
  const { notificationsEnabled } = state.notifications;
  return {
    theme: appTheme,
    visibleSections,
    notificationsEnabled,
  };
};

const mapDispatchToProps = dispatch => ({
  clearState: () => {
    dispatch(stateActions.clear());
  },
  disableNotifications: () => {
    dispatch(notifications.disable());
  },
  enableNotifications: () => {
    dispatch(notifications.enable());
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
