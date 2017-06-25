import { connect } from 'react-redux';
import Component from './component.jsx';
import { teams as teamsActions } from '../../actions';

const { team } = teamsActions;

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => (
  {
    chatClick: (channel, fromTeam) => {
      dispatch(team.stream.sendCurrentTab({ channel, team: fromTeam }));
    },
  }
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Component);
