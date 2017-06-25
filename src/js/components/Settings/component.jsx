import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from './style.scss';
import Button from '../Button';
import Checkbox from '../Checkbox';
import SectionTitle from '../SectionTitle';
import Swatch from '../Swatch';
import Switch from '../Switch';
import RouteWrapper from '../RouteWrapper';
import { CHAT_LISTS, THEMES, THEME_COLORS } from '../../helpers/constants';

const Settings = ({
  clearState,
  hideSection,
  location,
  setTheme,
  showSection,
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

  return (
    <RouteWrapper location={location}>
      <div>
        <SectionTitle title="Show Sections" />
        {sectionToggles}

        <SectionTitle title="Preferences" />
        <Switch
          checked={theme === THEMES.DARK}
          label="Dark mode"
          onChange={(checked) => {
            const nextTheme = checked ? THEMES.DARK : THEMES.DEFAULT;
            setTheme(nextTheme);
          }}
        />
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
  hideSection: PropTypes.func.isRequired,
  location: PropTypes.objectOf(
    PropTypes.string,
  ).isRequired,
  setTheme: PropTypes.func.isRequired,
  showSection: PropTypes.func.isRequired,
  theme: PropTypes.oneOf(Object.values(THEMES)).isRequired,
  visibleSections: PropTypes.arrayOf(
    PropTypes.oneOf(Object.values(CHAT_LISTS).map(x => x.NAME)),
  ).isRequired,
};

export default CSSModules(Settings, styles);
