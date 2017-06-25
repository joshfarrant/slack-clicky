import { connect } from 'react-redux';
import Component from './component.jsx';
import { teams as teamsActions } from '../../actions';

const { team } = teamsActions;

const mapStateToProps = (state) => {
  const { theme, themeColor } = state.app;
  const { authenticatingTeam } = state.teams.meta;
  const pendingTeams = state.teams.pending;
  return {
    authenticatingTeam,
    pendingTeams,
    theme,
    themeColor,
  };
};

const mapDispatchToProps = dispatch => ({
  cancelAuth: () => {
    dispatch(team.authenticated({}, true));
  },
  refreshTeam: (token) => {
    dispatch(team.refresh({ token }));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Component);
