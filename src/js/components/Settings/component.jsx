import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from './style.scss';
import Button from '../Button';
import Checkbox from '../Checkbox';
import SectionTitle from '../SectionTitle';
import Select from '../Select';
import Swatch from '../Swatch';
import Switch from '../Switch';
import RouteWrapper from '../RouteWrapper';
import { CHAT_LISTS, THEMES, THEME_COLORS } from '../../helpers/constants';
import { formatAllChats } from '../../helpers/chatFormatters';

const Settings = ({
  clearState,
  disableNotifications,
  enableNotifications,
  hideSection,
  location,
  notificationsEnabled,
  quickSendChat,
  setQuickSend,
  setTheme,
  showSection,
  teams,
  theme,
  visibleSections,
}) => {
  // Build toggles for sections
  const sectionToggles = Object.values(CHAT_LISTS)
  .map(({ DESCRIPTION, NAME, TITLE }) => (
    <Checkbox
      key={NAME}
      checked={visibleSections.includes(NAME)}
      info={DESCRIPTION}
      label={TITLE}
      onChange={(checked) => {
        if (checked) showSection(NAME);
        else hideSection(NAME);
      }}
    />
  ));

  const swatches = Object.values(THEME_COLORS);

  let dropdownOptions = [];

  const formattedTeams = teams
  .map(team => (
    formatAllChats(team).map(x => ({
      id: x.id,
      team,
      label: x.label,
    }))
  ));

  formattedTeams.forEach((x) => {
    dropdownOptions = [
      ...dropdownOptions,
      ...x,
    ];
  });

  dropdownOptions = [
    {
      id: '',
      team: {},
      label: 'None',
    },
    ...dropdownOptions,
  ];

  return (
    <RouteWrapper location={location}>
      <div>
        <SectionTitle title="Show Sections" />
        {sectionToggles}

        <SectionTitle title="Quick-Send Chat" />
        <Select
          value={quickSendChat.id}
          valueKey="id"
          options={dropdownOptions}
          placeholder="Press Ctrl+Alt+C to send to this chat"
          onChange={({ id, team }) => {
            setQuickSend(id, team);
          }}
        />
        <p>
          Press Alt+Shift+C from anywhere in Chrome to immediately send your
          current page to this chat.
          You can change this shortcut from the bottom of the chrome://extensions page.
        </p>

        <SectionTitle title="Preferences" />
        <div styleName="switch-container">
          <Switch
            checked={theme === THEMES.DARK}
            label="Dark mode"
            onChange={(checked) => {
              const nextTheme = checked ? THEMES.DARK : THEMES.DEFAULT;
              setTheme(nextTheme);
            }}
          />
        </div>
        <div styleName="switch-container">
          <Switch
            checked={notificationsEnabled}
            label="Show Notifications"
            onChange={checked => (
              checked ? enableNotifications() : disableNotifications()
            )}
          />
        </div>
        <div styleName="swatch-container">
          <div>Theme colour</div>
          <div styleName="option">
            {swatches.map(color => (
              <Swatch key={color} colorName={color} />
            ))}
          </div>
        </div>

        <SectionTitle title="Other" />
        <div styleName="option-container">
          <div>Clear local data</div>
          <div styleName="option">
            <Button
              onClick={() => {
                clearState();
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </RouteWrapper>
  );
};

Settings.propTypes = {
  clearState: PropTypes.func.isRequired,
  disableNotifications: PropTypes.func.isRequired,
  enableNotifications: PropTypes.func.isRequired,
  hideSection: PropTypes.func.isRequired,
  location: PropTypes.objectOf(
    PropTypes.string,
  ).isRequired,
  notificationsEnabled: PropTypes.bool.isRequired,
  quickSendChat: PropTypes.shape({
    id: PropTypes.string.isRequired,
    team: PropTypes.object.isRequired,
  }).isRequired,
  setQuickSend: PropTypes.func.isRequired,
  setTheme: PropTypes.func.isRequired,
  showSection: PropTypes.func.isRequired,
  teams: PropTypes.arrayOf(
    PropTypes.object,
  ).isRequired,
  theme: PropTypes.oneOf(Object.values(THEMES)).isRequired,
  visibleSections: PropTypes.arrayOf(
    PropTypes.oneOf(Object.values(CHAT_LISTS).map(x => x.NAME)),
  ).isRequired,
};

export default CSSModules(Settings, styles);
