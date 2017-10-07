import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import CSSModules from 'react-css-modules';
import About from '../About';
import App from '../App';
import InfoMessage from '../InfoMessage';
import Settings from '../Settings';
import ShareIcon from '../icons/ShareIcon';
import HeartIcon from '../icons/HeartIcon';
import Teams from '../Teams';
import { ROUTES, THEMES, THEME_COLORS } from '../../helpers/constants';
import styles from './style.scss';

class Root extends Component {

  static propTypes = {
    authenticatingTeam: PropTypes.bool.isRequired,
    cancelAuth: PropTypes.func.isRequired,
    pendingTeams: PropTypes.arrayOf(
      PropTypes.string,
    ).isRequired,
    refreshTeam: PropTypes.func.isRequired,
    theme: PropTypes.oneOf(Object.values(THEMES)).isRequired,
    themeColor: PropTypes.oneOf(Object.values(THEME_COLORS)).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      hasNewPermissions: chrome.idle,
    };
  }

  componentDidMount() {
    const { pendingTeams, refreshTeam, themeColor } = this.props;
    this.setThemeColor(themeColor);
    // Refresh each pending team
    pendingTeams.forEach(refreshTeam);
  }

  componentWillReceiveProps(nextProps) {
    const { themeColor } = nextProps;
    this.setThemeColor(themeColor);
  }

  setThemeColor = (color) => {
    this.themeContainer.style.setProperty('--main-highlight-color', color);
  };

  render() {
    const { hasNewPermissions } = this.state;
    const { authenticatingTeam, cancelAuth, theme } = this.props;

    let styleName;

    switch (theme) {
      case THEMES.DARK:
        styleName = 'dark-theme';
        break;
      case THEMES.DEFAULT:
      default:
        styleName = 'base-theme';
        break;
    }

    let infoMessage;

    if (!hasNewPermissions) {
      infoMessage = (
        <InfoMessage
          fullScreen
          icon={<HeartIcon />}
          title="#Clicky Has Updated"
        >
          <p>
            #Clicky has updated and requires
            <br />
            a few new permissions.
            <br />
            Click below to review and accept them.
          </p>
          <p
            styleName="info-action"
            onClick={() => {
              chrome.permissions.request({
                permissions: ['idle'],
              }, (granted) => {
                // Set permissions state
                this.setState({
                  hasNewPermissions: granted,
                });

                // Reload extension
                if (granted) chrome.runtime.reload();
              });
            }}
          >
            See permissions
          </p>
        </InfoMessage>
      );
    } else if (authenticatingTeam) {
      infoMessage = (
        <InfoMessage
          fullScreen
          icon={<ShareIcon />}
          title="Opening Slack"
        >
          <p>
            Authorize with Slack, then come
            <br />
            back here when you&#39;re done!
          </p>
          <p
            styleName="info-action"
            onClick={() => {
              cancelAuth();
            }}
          >
            Something not working?
          </p>
        </InfoMessage>
      );
    }

    return (
      <Router>
        <div
          styleName={styleName}
          ref={(node) => {
            this.themeContainer = node;
          }}
        >
          <Route exact path={ROUTES.HOME.ROUTE} component={App} />
          <Route path={ROUTES.TEAMS.ROUTE} component={Teams} />
          <Route path={ROUTES.SETTINGS.ROUTE} component={Settings} />
          <Route path={ROUTES.ABOUT.ROUTE} component={About} />
          {infoMessage}
        </div>
      </Router>
    );
  }

}

export default CSSModules(Root, styles);
