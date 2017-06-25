import { connect } from 'react-redux';
import Component from './component.jsx';

const mapStateToProps = (state, ownProps) => {
  const { id, team } = ownProps;
  const teamId = team.team.id;
  const { messages } = state.teams.data[teamId].clicky;
  const message = messages.find(m => m.channel === id);
  // const status = message ? message.status : undefined;
  let status;
  // If message has a status and was created recently
  if (message && message.status && (Date.now() < message.created + 7000)) {
    status = message.status;
  }
  return {
    status,
  };
};

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Component);
