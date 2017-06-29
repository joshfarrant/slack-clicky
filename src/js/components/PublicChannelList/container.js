import { connect } from 'react-redux';
import { CHAT_LISTS } from '../../helpers/constants';
import Component from './component.jsx';

const mapStateToProps = state => ({
  hideStarred: state.app.visibleSections.includes(CHAT_LISTS.STARRED_CHAT_LIST.NAME),
});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Component);
