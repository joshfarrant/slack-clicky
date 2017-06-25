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
          {authenticatingTeam && (
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
          )}
        </div>
      </Router>
    );
  }

}

export default CSSModules(Root, styles);
