import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import ReactTooltip from 'react-tooltip';
import PlusIcon from '../icons/PlusIcon';
import RefreshIcon from '../icons/RefreshIcon';
import TeamIcon from '../TeamIcon';
import styles from './style.scss';

const TeamSelect = ({
  addTeam,
  authenticatingTeam,
  refreshingTeam,
  refreshTeam,
  selectedTeamId,
  selectTeam,
  teams,
}) => (
  <div styleName="container">
    {teams.map((t) => {
      const { id } = t.team;
      const { token } = t.clicky;
      const selected = id === selectedTeamId;
      return (
        <div
          key={id}
          styleName="team-container"
        >
          <TeamIcon
            styleName={selected ? 'selected-icon' : 'icon'}
            onClick={() => {
              if (selected) {
                refreshTeam(token);
              } else {
                selectTeam(id);
              }
            }}
            team={t.team}
          />
          {selected && (
            <div
              styleName={refreshingTeam ? 'refreshing-icon-container' : 'refresh-icon-container'}
              onClick={() => {
                refreshTeam(token);
              }}
            >
              <RefreshIcon
                styleName={refreshingTeam ? 'refreshing-icon' : 'refresh-icon'}
                data-tip="Refresh team"
                data-delay-show="500"
              />
              <ReactTooltip
                place="right"
                type="dark"
                effect="solid"
              />
            </div>
          )}
        </div>
      );
    })}
    <div
      styleName="add-container"
      onClick={() => {
        if (!authenticatingTeam) {
          addTeam();
        }
      }}
    >
      <div
        styleName="add-team"
      >
        <PlusIcon
          data-tip="Add a team"
          data-delay-show="500"
        />
        <ReactTooltip
          place="right"
          type="dark"
          effect="solid"
        />
      </div>
      {teams.length === 0 && (
        <div styleName="add-message">
          Add your first team
        </div>
      )}
    </div>
  </div>
);

TeamSelect.propTypes = {
  addTeam: PropTypes.func.isRequired,
  authenticatingTeam: PropTypes.bool.isRequired,
  refreshingTeam: PropTypes.bool.isRequired,
  refreshTeam: PropTypes.func.isRequired,
  selectedTeamId: PropTypes.string.isRequired,
  selectTeam: PropTypes.func.isRequired,
  teams: PropTypes.arrayOf(
    PropTypes.object,
  ).isRequired,
};

export default CSSModules(TeamSelect, styles);
