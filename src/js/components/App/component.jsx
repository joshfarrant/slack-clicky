import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Announcement from '../Announcement';
import ChannelList from '../ChannelList';
import DirectionsIcon from '../icons/DirectionsIcon';
import DmList from '../DmList';
import ImList from '../ImList';
import InfoMessage from '../InfoMessage';
import MessageBox from '../MessageBox';
import MpimList from '../MpimList';
import PrivateChannelList from '../PrivateChannelList';
import PublicChannelList from '../PublicChannelList';
import StarredChatList from '../StarredChatList';
import RouteWrapper from '../RouteWrapper';
import SectionTitle from '../SectionTitle';
import TeamSelect from '../TeamSelect';
import { CHAT_LISTS, ROUTES } from '../../helpers/constants';

const App = ({
  hideAnnouncement,
  location,
  selectedTeam,
  teams,
  visibleSections,
}) => {
  // Map sections to their components
  const sectionMap = {
    [CHAT_LISTS.STARRED_CHAT_LIST.NAME]: StarredChatList,
    [CHAT_LISTS.CHANNEL_LIST.NAME]: ChannelList,
    [CHAT_LISTS.DM_LIST.NAME]: DmList,
    [CHAT_LISTS.IM_LIST.NAME]: ImList,
    [CHAT_LISTS.MPIM_LIST.NAME]: MpimList,
    [CHAT_LISTS.PRIVATE_CHANNEL_LIST.NAME]: PrivateChannelList,
    [CHAT_LISTS.PUBLIC_CHANNEL_LIST.NAME]: PublicChannelList,
  };

  // Iterate through sections building the element for each
  const sections = Object.values(CHAT_LISTS)
  .filter(({ NAME }) => visibleSections.includes(NAME))
  .map(({ NAME, TITLE }) => {
    const Component = sectionMap[NAME];
    return (
      <div key={NAME}>
        <SectionTitle title={TITLE} />
        <Component team={selectedTeam} />
      </div>
    );
  });

  const showSections = teams.length > 0 && visibleSections.length > 0;
  const noVisibleSections = visibleSections.length === 0;

  const announcementId = 'v3.2.0';
  const announcementTitle = 'New in v3.2.0';
  const announcementMessage = (
    <span>
      <p>
        You can now send #Clickys without including a link to your current page!
        This allows you to use #Clicky to quickly reply to a message, without having
        to open Slack and find the correct channel.
      </p>
      <p>
        Just type your message into the message box below, then click the
        channel or person that you&#39;d like to send the message to. #Clicky will send
        whatever you type into that box, whether it includes a link or not.
      </p>
      <p>
        Got a feature that you&#39;d like to see in #Clicky?
        Let me know!
      </p>
    </span>
  );

  return (
    <RouteWrapper location={location}>
      <Announcement
        id={announcementId}
        title={announcementTitle}
        message={announcementMessage}
        onClose={() => {
          hideAnnouncement(announcementId);
        }}
      />
      <div>
        <MessageBox />
        <SectionTitle title="Teams" />
        <TeamSelect />
        {showSections && (
          <div>{sections}</div>
        )}
        {noVisibleSections && (
          <InfoMessage
            title="Where's everything gone?"
            icon={<DirectionsIcon />}
          >
            <Link to={ROUTES.SETTINGS.ROUTE}>
              Enable some sections
            </Link> to get started!
          </InfoMessage>
        )}
      </div>
    </RouteWrapper>
  );
};

App.propTypes = {
  hideAnnouncement: PropTypes.func.isRequired,
  location: PropTypes.objectOf(
    PropTypes.string,
  ).isRequired,
  selectedTeam: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  teams: PropTypes.arrayOf(
    PropTypes.object,
  ).isRequired,
  visibleSections: PropTypes.arrayOf(
    PropTypes.oneOf(Object.values(CHAT_LISTS).map(x => x.NAME)),
  ).isRequired,
};

App.defaultProps = {
  selectedTeam: {},
};

export default App;
