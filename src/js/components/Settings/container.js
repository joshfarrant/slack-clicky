import { connect } from 'react-redux';
import Component from './component.jsx';
import {
  app as appActions,
  state as stateActions,
  notifications as notificationsActions,
} from '../../actions';

const { quickSend, section, theme } = appActions;

const { notifications } = notificationsActions;

const mapStateToProps = (state) => {
  const { theme: appTheme, quickSendChat, visibleSections } = state.app;
  const { notificationsEnabled } = state.notifications;
  const teamsObj = state.teams.data;
  const teams = Object.values(teamsObj);
  return {
    theme: appTheme,
    visibleSections,
    notificationsEnabled,
    teams,
    quickSendChat,
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
  setQuickSend: (id, team) => {
    dispatch(quickSend.set({ id, team }));
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
