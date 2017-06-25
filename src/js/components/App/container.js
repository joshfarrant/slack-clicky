import { connect } from 'react-redux';
import Component from './component.jsx';
import { app as appActions } from '../../actions';

const { announcement } = appActions;

const mapStateToProps = (state) => {
  const teamsObj = state.teams.data;
  const teams = Object.values(teamsObj);
  const { selectedTeamId } = state.teams.meta;
  const selectedTeam = teamsObj[selectedTeamId];
  const { visibleSections } = state.app;
  return {
    selectedTeam,
    teams,
    visibleSections,
  };
};

const mapDispatchToProps = dispatch => ({
  hideAnnouncement: (id) => {
    dispatch(announcement.hide({ id }));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Component);
