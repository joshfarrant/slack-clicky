import { connect } from 'react-redux';
import Component from './component.jsx';

const mapStateToProps = state => ({
  useDisplayNames: state.app.useDisplayNames,
});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Component);
