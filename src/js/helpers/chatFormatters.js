import { SLACK } from './constants';

const buildUserMap = team => new Map(team.clicky.userArray);

export const getUserDisplayName = (user, useDisplayNames) => {
  const {
    display_name: displayName,
    first_name: firstName,
    last_name: lastName,
  } = user.profile;
  let name;

  if (useDisplayNames && displayName) {
    return displayName;
  }

  if (firstName) {
    if (lastName) {
      name = `${firstName} ${lastName}`;
    } else {
      name = firstName;
    }
  } else if (user.name) {
    name = user.name;
  } else {
    name = user.id;
  }

  return name;
};

export const formatIms = (team, hideStarred, useDisplayNames) => {
  const userMap = buildUserMap(team);
  return team.ims
  .filter(im => im.is_open && im.user !== SLACK.SLACKBOT_USER)
  .filter(im => (hideStarred ? !im.is_starred : true))
  .map((im) => {
    const user = userMap.get(im.user);
    const label = getUserDisplayName(user, useDisplayNames);

    return {
      id: im.id,
      label,
    };
  });
};

export const formatMpims = (team, hideStarred, useDisplayNames) => {
  const userMap = buildUserMap(team);
  return team.groups
  .filter(group => group.is_mpim && !group.is_archived && group.is_open)
  .filter(group => (hideStarred ? !group.is_starred : true))
  .map((group) => { // Build pretty label composed of group member names
    const label = group.members
    .filter(member => member !== team.self.id) // Filter yourself out of the list of members
    .map((member) => {
      const user = userMap.get(member);
      return useDisplayNames ? user.profile.display_name : (user.profile.first_name || user.name);
    })
    .join(', ');
    return {
      id: group.id,
      label,
    };
  });
};

export const formatGroups = (team, hideStarred, useDisplayNames) => {
  const userMap = buildUserMap(team);
  return team.groups
  .filter(group => !group.is_archived && group.is_open)
  .filter(group => (hideStarred ? !group.is_starred : true))
  .map((group) => {
    let label = group.name;

    if (group.is_mpim) {
      label = group.members
      .filter(member => member !== team.self.id) // Filter yourself out of the list of members
      .map((member) => {
        const user = userMap.get(member);
        return useDisplayNames ? user.profile.display_name : (user.profile.first_name || user.name);
      })
      .join(', ');
    }

    return {
      id: group.id,
      label,
    };
  });
};

export const formatPublicChannels = (team, hideStarred) => (
  team.channels
  .filter(channel => !channel.is_archived && channel.is_member)
  .filter(channel => (hideStarred ? !channel.is_starred : true))
  .map(channel => ({
    id: channel.id,
    label: `#${channel.name}`,
  }))
);

export const formatPrivateChannels = (team, hideStarred) => (
  team.groups
  .filter(group => !group.is_mpim && !group.is_archived && group.is_open)
  .filter(group => (hideStarred ? !group.is_starred : true))
  .map(group => ({
    id: group.id,
    label: group.name,
  }))
);

export const formatChannels = (team, hideStarred) => (
  [
    ...formatPublicChannels(team, hideStarred),
    ...formatPrivateChannels(team, hideStarred),
  ]
);

export const formatDms = (team, hideStarred, useDisplayNames) => (
  [
    ...formatIms(team, hideStarred, useDisplayNames),
    ...formatMpims(team, hideStarred, useDisplayNames),
  ]
);

export const formatStarredChannels = team => (
  team.channels
  .filter(channel => !channel.is_archived && channel.is_starred)
  .map(channel => ({
    id: channel.id,
    label: `#${channel.name}`,
  }))
);

export const formatStarredIms = (team, useDisplayNames) => {
  const userMap = buildUserMap(team);
  return team.ims
  .filter(im => !im.is_archived && im.is_starred)
  .map((im) => {
    const user = userMap.get(im.user);
    const label = getUserDisplayName(user, useDisplayNames);
    return {
      id: im.id,
      label,
    };
  });
};

export const formatStarredGroups = (team, useDisplayNames) => {
  const userMap = buildUserMap(team);
  return team.groups
  .filter(group => !group.is_archived && group.is_starred)
  .map((group) => {
    let label = group.name;

    if (group.is_mpim) {
      label = group.members
      .filter(member => member !== team.self.id) // Filter yourself out of the list of members
      .map((member) => {
        const user = userMap.get(member);
        return useDisplayNames ? user.profile.display_name : (user.profile.first_name || user.name);
      })
      .join(', ');
    }

    return {
      id: group.id,
      label,
    };
  });
};

export const formatStarredChats = (team, useDisplayNames) => (
  [
    ...formatStarredChannels(team),
    ...formatStarredIms(team, useDisplayNames),
    ...formatStarredGroups(team, useDisplayNames),
  ]
);

export const formatAllChats = (team, hideStarred) => (
  [
    ...formatChannels(team, hideStarred),
    ...formatDms(team, hideStarred),
  ]
);
