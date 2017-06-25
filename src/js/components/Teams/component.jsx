import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import { Link } from 'react-router-dom';
import styles from './style.scss';
import ConfirmButton from '../ConfirmButton';
import CrossIcon from '../icons/CrossIcon';
import InfoMessage from '../InfoMessage';
import RouteWrapper from '../RouteWrapper';
import SectionTitle from '../SectionTitle';
import TeamIcon from '../TeamIcon';
import UserIcon from '../icons/UserIcon';
import { ROUTES } from '../../helpers/constants';

const Teams = ({
  location,
  removeTeam,
  teams,
}) => (
  <RouteWrapper location={location}>
    <div>
      <SectionTitle title="Authenticated Teams" />
      {teams.length > 0 ? (
        <ul styleName="list">
          {teams.map(t => (
            <li
              key={t.team.id}
              styleName="list-item"
            >
              <TeamIcon
                team={t.team}
                styleName="team-icon"
              />
              <span styleName="team-name">{t.team.name}</span>
              <ConfirmButton
                message="Delete team?"
                onClick={() => {
                  removeTeam(t.team.id);
                }}
              >
                <CrossIcon />
              </ConfirmButton>
            </li>
          ))}
        </ul>
      ) : (
        <InfoMessage
          title="It's quiet around here"
          icon={<UserIcon />}
        >
          <Link to={ROUTES.HOME.ROUTE}>
            Add a team
          </Link> to get started!
        </InfoMessage>
      )}
    </div>
  </RouteWrapper>
);

Teams.propTypes = {
  location: PropTypes.objectOf(
    PropTypes.string,
  ).isRequired,
  removeTeam: PropTypes.func.isRequired,
  teams: PropTypes.arrayOf(
    PropTypes.object,
  ).isRequired,
};

Teams.defaultProps = {
  errorMessage: '',
};

export default CSSModules(Teams, styles);
