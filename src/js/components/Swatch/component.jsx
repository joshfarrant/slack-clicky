import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import { THEME_COLORS } from '../../helpers/constants';
import styles from './style.scss';

class Swatch extends Component {

  static propTypes = {
    colorName: PropTypes.oneOf(Object.values(THEME_COLORS)).isRequired,
    setThemeColor: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    themeColor: PropTypes.oneOf(Object.values(THEME_COLORS)).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      selected: this.isSelected(this.props),
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      selected: nextProps.colorName === nextProps.themeColor,
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.selected !== nextState.selected;
  }

  isSelected = props => props.colorName === props.themeColor

  render() {
    const {
      props: { colorName, setThemeColor },
      state: { selected },
    } = this;
    return (
      <div
        styleName={selected ? 'swatch-selected' : 'swatch'}
        onClick={() => {
          setThemeColor(colorName);
        }}
        style={{
          backgroundColor: colorName,
        }}
      />
    );
  }

}

export default CSSModules(Swatch, styles);
