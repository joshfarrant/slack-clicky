import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import onClickOutside from 'react-onclickoutside';
import styles from './style.scss';

class ConfirmButton extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
    message: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  }

  state = {
    clicked: false,
  }

  handleClickOutside = () => {
    const { clicked } = this.state;
    if (clicked) {
      this.setState({
        clicked: false,
      });
    }
  }

  render() {
    const {
      props: { children, message, onClick },
      state: { clicked },
    } = this;

    return (
      <div
        styleName={clicked ? 'container-clicked' : 'container'}
        onClick={() => {
          if (clicked) {
            onClick();
          } else {
            this.setState({
              clicked: true,
            });
          }
        }}
      >
        {clicked && (
          <span styleName="confirm">{message}</span>
        )}
        {children}
      </div>
    );
  }

}

export default onClickOutside(CSSModules(ConfirmButton, styles));
