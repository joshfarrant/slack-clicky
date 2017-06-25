import { connect } from 'react-redux';
import Component from './component.jsx';
import { app as appActions } from '../../actions';

const { message } = appActions;

const mapStateToProps = state => ({
  message: state.app.message,
});

const mapDispatchToProps = dispatch => ({
  setMessage: (text) => {
    dispatch(message.set({ message: text }));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Component);
