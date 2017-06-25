import { connect } from 'react-redux';
import Component from './component.jsx';
import { teams as teamsActions } from '../../actions';

const { team } = teamsActions;

const mapStateToProps = (state) => {
  const teamsObj = state.teams.data;
  const { authenticatingTeam, refreshingTeam, selectedTeamId } = state.teams.meta;
  const teams = Object.values(teamsObj);
  return {
    authenticatingTeam,
    refreshingTeam,
    selectedTeamId,
    teams,
  };
};

const mapDispatchToProps = dispatch => (
  {
    addTeam: () => {
      dispatch(team.authenticate());
    },
    refreshTeam: (token) => {
      dispatch(team.refresh({ token }));
    },
    selectTeam: (id) => {
      dispatch(team.select({ id }));
    },
  }
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Component);
