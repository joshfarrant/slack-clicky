import { SLACK } from './constants';

const buildUserMap = team => new Map(team.clicky.userArray);

export const getUserDisplayName = (user) => {
  const { first_name: firstName, last_name: lastName } = user.profile;
  let displayName;

  if (firstName) {
    if (lastName) {
      displayName = `${firstName} ${lastName}`;
    } else {
      displayName = firstName;
    }
  } else if (user.name) {
    displayName = user.name;
  } else {
    displayName = user.id;
  }

  return displayName;
};

export const formatIms = (team, hideStarred) => {
  const userMap = buildUserMap(team);
  return team.ims
  .filter(im => im.is_open && im.user !== SLACK.SLACKBOT_USER)
  .filter(im => hideStarred && !im.is_starred)
  .map((im) => {
    const user = userMap.get(im.user);
    const label = getUserDisplayName(user);

    return {
      id: im.id,
      label,
    };
  });
};

export const formatMpims = (team, hideStarred) => {
  const userMap = buildUserMap(team);
  return team.groups
  .filter(group => group.is_mpim && !group.is_archived && group.is_open)
  .filter(im => hideStarred && !im.is_starred)
  .map((group) => { // Build pretty label composed of group member names
    const label = group.members
    .filter(member => member !== team.self.id) // Filter yourself out of the list of members
    .map((member) => {
      const user = userMap.get(member);
      return user.profile.first_name || user.name;
    })
    .join(', ');
    return {
      id: group.id,
      label,
    };
  });
};

export const formatGroups = (team, hideStarred) => {
  const userMap = buildUserMap(team);
  return team.groups
  .filter(group => !group.is_archived && group.is_open)
  .filter(im => hideStarred && !im.is_starred)
  .map((group) => {
    let label = group.name;

    if (group.is_mpim) {
      label = group.members
      .filter(member => member !== team.self.id) // Filter yourself out of the list of members
      .map((member) => {
        const user = userMap.get(member);
        return user.profile.first_name || user.name;
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
  .filter(im => hideStarred && !im.is_starred)
  .map(channel => ({
    id: channel.id,
    label: `#${channel.name}`,
  }))
);

export const formatPrivateChannels = (team, hideStarred) => (
  team.groups
  .filter(group => !group.is_mpim && !group.is_archived && group.is_open)
  .filter(im => hideStarred && !im.is_starred)
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

export const formatDms = (team, hideStarred) => (
  [
    ...formatIms(team, hideStarred),
    ...formatMpims(team, hideStarred),
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

export const formatStarredIms = (team) => {
  const userMap = buildUserMap(team);
  return team.ims
  .filter(im => !im.is_archived && im.is_starred)
  .map((im) => {
    const user = userMap.get(im.user);
    const label = getUserDisplayName(user);
    return {
      id: im.id,
      label,
    };
  });
};

export const formatStarredGroups = (team) => {
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
        return user.profile.first_name || user.name;
      })
      .join(', ');
    }

    return {
      id: group.id,
      label,
    };
  });
};

export const formatStarredChats = team => (
  [
    ...formatStarredChannels(team),
    ...formatStarredIms(team),
    ...formatStarredGroups(team),
  ]
);

export const formatAllChats = (team, hideStarred) => (
  [
    ...formatChannels(team, hideStarred),
    ...formatDms(team, hideStarred),
  ]
);
