import { connect } from 'react-redux';
import Component from './component.jsx';
import { app as appActions } from '../../actions';

const {
  currentTabUrl,
  message,
} = appActions;

const mapStateToProps = state => ({
  message: state.app.message,
  currentTabUrl: state.app.currentTabUrl,
});

const mapDispatchToProps = dispatch => ({
  setMessage: (text) => {
    dispatch(message.set({ message: text }));
  },
  getCurrentTabUrl: () => {
    dispatch(currentTabUrl.get());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Component);
