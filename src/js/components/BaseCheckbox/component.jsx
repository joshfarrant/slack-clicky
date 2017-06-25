import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import ReactTooltip from 'react-tooltip';
import InfoIcon from '../icons/InfoIcon';
import TickIcon from '../icons/TickIcon';
import { getUniqueId } from '../../helpers/utils';
import styles from './styles.scss';

const KINDS = {
  CHECKBOX: 'checkbox',
  SWITCH: 'switch',
};

class BaseCheckbox extends Component {

  static propTypes = {
    checked: PropTypes.bool.isRequired,
    info: PropTypes.string,
    kind: PropTypes.oneOf([
      KINDS.CHECKBOX,
      KINDS.SWITCH,
    ]).isRequired,
    label: PropTypes.string,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    info: '',
    label: '',
    onChange: () => {},
  }

  state = {
    checkboxId: getUniqueId('base-checkbox'),
  }

  onChange = () => {
    const { checked, onChange } = this.props;
    onChange(!checked);
  }

  render() {
    const { checked, info, kind, label } = this.props;
    const { checkboxId } = this.state;
    const { SWITCH, CHECKBOX } = KINDS;

    let content;

    switch (kind) {
      case SWITCH: {
        content = (
          <div styleName="switch-base">
            <input
              styleName={checked ? 'switch-input-checked' : 'switch-input'}
              id={checkboxId}
              type="checkbox"
              checked={checked}
              onChange={this.onChange}
            />
            <label
              styleName="switch-label"
              htmlFor={checkboxId}
            />
            <div
              styleName="switch-handle"
              onClick={this.onChange}
            />
          </div>
        );
        break;
      }
      default:
      case CHECKBOX: {
        content = (
          <div styleName="checkbox-base">
            <input
              styleName={checked ? 'checkbox-input-checked' : 'checkbox-input'}
              id={checkboxId}
              type="checkbox"
              checked={checked}
              onChange={this.onChange}
            />
            {checked ? <TickIcon styleName="checkbox-icon" /> : ''}
            <label
              styleName="checkbox-label"
              htmlFor={checkboxId}
            />
          </div>
        );
        break;
      }
    }
    return (
      <div styleName="container">
        <div
          styleName="label"
          onClick={this.onChange}
        >
          {label}
          {info && (
            <div>
              <InfoIcon
                styleName="info-icon"
                data-tip={info}
              />
              <ReactTooltip
                delayShow={300}
                effect="solid"
                place="bottom"
                type="dark"
              />
            </div>
          )}
        </div>
        {content}
      </div>
    );
  }

}

export default CSSModules(BaseCheckbox, styles);
