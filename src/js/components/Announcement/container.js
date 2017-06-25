import { connect } from 'react-redux';
import Component from './component.jsx';

const mapStateToProps = state => ({
  hiddenAnnouncements: state.app.hiddenAnnouncements,
});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Component);
