import { connect } from 'react-redux';
import Component from './component.jsx';
import { teams as teamsActions } from '../../actions';

const { team } = teamsActions;

const mapStateToProps = (state) => {
  const teamsObj = state.teams.data;
  const teams = Object.values(teamsObj);
  return {
    teams,
  };
};

const mapDispatchToProps = dispatch => (
  {
    removeTeam: (id) => {
      dispatch(team.remove({ id }));
    },
  }
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Component);
