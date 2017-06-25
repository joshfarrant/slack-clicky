import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Confetti from 'react-dom-confetti';
import CSSModules from 'react-css-modules';
import HeartIcon from '../icons/HeartIcon';
import HomeIcon from '../icons/HomeIcon';
import SettingsIcon from '../icons/SettingsIcon';
import GroupIcon from '../icons/GroupIcon';
import { PRODUCT, ROUTES } from '../../helpers/constants';
import styles from './style.scss';

class Header extends Component {

  static propTypes = {
    location: PropTypes.objectOf(
      PropTypes.string,
    ).isRequired,
  }

  state = {
    pop: false,
    popTimeout: undefined,
  }

  componentWillUnmount() {
    const { popTimeout } = this.state;
    clearTimeout(popTimeout);
  }

  getRouteTitle = () => {
    const { pathname } = this.props.location;
    const currentRoute = Object.values(ROUTES).find(r => r.ROUTE === pathname);
    return currentRoute.NAME || PRODUCT.NAME;
  }

  getIconClass = routeName => (
    this.props.location.pathname === routeName ? 'icon-active' : 'icon'
  )

  confetti = () => {
    const { pop, popTimeout } = this.state;
    const timeout = 5000;
    // Limit confetti to once every [timeout] ms
    if (!pop && !popTimeout) {
      this.setState({
        pop: true,
        popTimeout: setTimeout(() => {
          this.setState({
            pop: false,
            popTimeout: undefined,
          });
        }, timeout),
      });
    }
  }

  render() {
    const { pop } = this.state;

    const config = {
      angle: 338,
      spread: 100,
      startVelocity: 12,
      elementCount: 40,
      decay: 0.93,
    };

    return (
      <div styleName="container">
        <Confetti active={pop} config={config} />
        <span
          styleName="product"
        >
          <span onClick={this.confetti}>
            {this.getRouteTitle()}
          </span>
        </span>
        <Link
          to={ROUTES.HOME.ROUTE}
          styleName={this.getIconClass(ROUTES.HOME.ROUTE)}
        >
          <HomeIcon />
        </Link>
        <Link
          to={ROUTES.TEAMS.ROUTE}
          styleName={this.getIconClass(ROUTES.TEAMS.ROUTE)}
        >
          <GroupIcon />
        </Link>
        <Link
          to={ROUTES.ABOUT.ROUTE}
          styleName={this.getIconClass(ROUTES.ABOUT.ROUTE)}
        >
          <HeartIcon />
        </Link>
        <Link
          to={ROUTES.SETTINGS.ROUTE}
          styleName={this.getIconClass(ROUTES.SETTINGS.ROUTE)}
        >
          <SettingsIcon />
        </Link>
      </div>
    );
  }

}

export default CSSModules(Header, styles);
