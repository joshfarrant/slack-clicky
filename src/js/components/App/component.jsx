import React from 'react';
import PropTypes from 'prop-types';
import Intercom from 'react-intercom';
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
import { CHAT_LISTS, INTERCOM, ROUTES } from '../../helpers/constants';

const findBiggestImage = (sizes, parent, keyName) => (
  // Descend through the sizes and return biggest image available
  sizes
  .map(size => parent[`${keyName}${size}`])
  .filter(image => !!image)[0] // Remove undefineds and select first
);

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
  const showIntercom = selectedTeam && selectedTeam.users;
  let intercomData = {};

  if (showIntercom && selectedTeam.users) {
    const team = selectedTeam;
    const user = team.users.find(u => u.id === team.self.id);
    const {
      channelArray,
      groupArray,
      userArray,
    } = team.clicky;

    intercomData = {
      app_id: INTERCOM.APP_ID,
      name: user.profile.real_name_normalized || user.real_name || user.name,
      email: user.profile.email,
      user_id: user.id,
      title: user.profile.title,
      username: user.name,
      user_image: findBiggestImage(
        ['512', '192', '72', '48', '32', '24'],
        user.profile,
        'image_',
      ),
      company: {
        id: team.team.id,
        name: team.team.name,
        team_email_domain: team.team.email_domain,
        team_image: findBiggestImage(
          ['original', '230', '132', '102', '88', '68', '44', '34'],
          team.team.icon,
          'image_',
        ),
        total_users: channelArray.length + groupArray.length + userArray.length,
      },
    };
  }

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
      {showIntercom && (
        <Intercom
          appID={INTERCOM.APP_ID}
          {...intercomData}
        />
      )}
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
