import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import MessageIcon from '../icons/MessageIcon';
import { isLink } from '../../helpers/utils';
import styles from './style.scss';

class MessageBox extends Component {

  static propTypes = {
    currentTabUrl: PropTypes.string.isRequired,
    getCurrentTabUrl: PropTypes.func.isRequired,
    message: PropTypes.string.isRequired,
    setMessage: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    // Keep a local copy of inputValue to prevent cursor flickering on textarea rerender
    this.state = {
      inputValue: '',
    };
  }

  componentDidMount() {
    const {
      input,
      props: {
        getCurrentTabUrl,
      },
    } = this;
    getCurrentTabUrl();

    input.focus();
  }

  componentWillReceiveProps(nextProps) {
    // Re-sync inputValue
    this.setState({
      inputValue: nextProps.message,
    });

    /**
     * Check to see if we've just recieved the currentTabUrl
     * If so, prepend it to the message
     */
    if (nextProps.currentTabUrl && this.props.currentTabUrl !== nextProps.currentTabUrl) {
      this.props.setMessage(`${nextProps.currentTabUrl} ${this.props.message}`);
    }
  }

  componentDidUpdate(prevProps) {
    /**
     * Select the text in the textarea as soon as we receive the link
     * This isn't neither perfect, nor a nice way to do this, but it works...
     */
    if (!prevProps.message || (prevProps.message && !isLink(prevProps.message.split(' ')[0]))) {
      /**
       * If previous props didn't have a message
       * or, if the previous message didn't start with a link
       */
      if (this.props.message && isLink(this.props.message.split(' ')[0])) {
        /**
         * If the current props do have a message
         * and, if the current message does start with a link
         */
        this.input.select();
      }
    }
  }

  onInputChange = (e) => {
    const { value } = e.target;
    const { setMessage } = this.props;
    // Update our local copy of inputValue
    this.setState({
      inputValue: value,
    });
    setMessage(value);
  }

  render() {
    const { inputValue } = this.state;

    return (
      <div
        styleName="container"
      >
        <textarea
          styleName="input"
          rows="3"
          ref={(node) => {
            this.input = node;
          }}
          placeholder="Attach message"
          value={inputValue}
          onChange={this.onInputChange}
        />
        <MessageIcon
          styleName="message-icon"
          onClick={() => {
            this.input.focus();
          }}
        />
      </div>
    );
  }

}

export default CSSModules(MessageBox, styles);
