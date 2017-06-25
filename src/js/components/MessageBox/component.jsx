import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import MessageIcon from '../icons/MessageIcon';
import styles from './style.scss';

class MessageBox extends Component {

  static propTypes = {
    message: PropTypes.string.isRequired,
    setMessage: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const {
      input,
      props: { message },
    } = this;
    input.focus();

    input.value = message;
  }

  onInputChange = (e) => {
    const { value } = e.target;
    const { setMessage } = this.props;
    setMessage(value);
  }

  render() {
    return (
      <div
        styleName="container"
      >
        <input
          styleName="input"
          ref={(node) => {
            this.input = node;
          }}
          placeholder="Attach message"
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
