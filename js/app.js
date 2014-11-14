var slackToken;
var team = localStorage.getItem('clicky-team');

// Gets current Clicky user from local storage if it exists
var user = JSON.parse(localStorage.getItem('clicky-user'));

var rooms = [];


// Gets list of all available (and unarchived) channels
function getChannels() {
  var data = {
    'token': slackToken,
    'exclude_archived': 1
  }

  // Checks if channels list exists in local storage
  // If not it is fetched from the Slack API
  // If it is, that is fetched instead
  if (localStorage.getItem('clicky-channels') === null) {
    $.ajax({
      type: 'POST',
      url: 'https://slack.com/api/channels.list',
      data: data,
      success: function(data) {
        if (data.ok === true) {
          var channels = data.channels;
          for (var i in channels) channels[i].name = '#' + channels[i].name;
          localStorage.setItem('clicky-channels', JSON.stringify(channels));
          buildChannelList(channels);
        } else {
          console.error('[error] Error getting channels: ' + data.error);
        }
      }
    });
  } else {
    var channelsJson = localStorage.getItem('clicky-channels');
    channels = JSON.parse(channelsJson);
    buildChannelList(channels);
  }
}


// Builds channel list in main interface
function buildChannelList(channels) {
  var list = $('#channelList');
  var html = '';
  $.each(channels, function(i) {
    var channel = channels[i];
    rooms.push(channel);
    html += '<li class="channel"><span class="share-link" id="share-channel" title="' + channel.purpose.value + '" data-room="' + channel.id + '">';
    html += channel.name + '</span>';
    html += '<span id="success-' + channel.id + '" class="label label-success"></span></li>';
  });
  list.html(html);
}


// Gets list of all users
function getUsers() {
  var data = {
    'token': slackToken
  }

  // Checks if users list exists in local storage
  // If not it is fetched from the Slack API
  // If it is, that is fetched instead
  if (localStorage.getItem('clicky-users') === null) { 
    $.ajax({
      type: 'POST',
      url: 'https://slack.com/api/users.list',
      data: data,
      success: function(data) {
        if (data.ok === true) {        
          var users = data.members;
          localStorage.setItem('clicky-users', JSON.stringify(users));
          buildUserList(users);
        } else {
          console.error('[error] Error getting users: ' + data.error);
        }        
      }
    });
  } else {
    var usersJson = localStorage.getItem('clicky-users');
    users = JSON.parse(usersJson);
    buildUserList(users);
  }
}


// Builds user list in main interface
function buildUserList(users) {
  var list = $('#userList');
  var html = '';

  $.each(users, function(i) {
    var user = users[i];
    rooms.push(user);
    html += '<li class="user"><span class="share-link" id="share-user" title="' + user.profile.real_name + '" data-room="' + user.id + '">';
    html += user.name + '</span>';
    html += '<span id="' + user.id + '" class="label label-success"></span></li>';
  });
  list.html(html);
}


// Gets list of all groups
function getGroups() {
  var data = {
    'token': slackToken,
    'exclude_archived': 1    
  }

  // Checks if group list exists in local storage
  // If not it is fetched from the Slack API
  // If it is, that is fetched instead
  if (localStorage.getItem('clicky-groups') === null) {
    $.ajax({
      type: 'POST',
      url: 'https://slack.com/api/groups.list',
      data: data,
      success: function(data) {
        if (data.ok === true) {
          var groups = data.groups;
          localStorage.setItem('clicky-groups', JSON.stringify(groups));
          buildGroupsList(groups);
        } else {
          console.error('[error] Error getting groups: ' + data.error);
        }
      }
    });
  } else {
    var groupsJson = localStorage.getItem('clicky-groups');
    groups = JSON.parse(groupsJson);
    buildGroupsList(groups);
  }
}


// Builds user list in 'Channels' interface
function buildGroupsList(groups) {
  var list = $('#groupList');
  var html = '';

  $.each(groups, function(i) {
    var group = groups[i];
    rooms.push(group);
    html += '<li class="group"><span id="share-group" class="share-link" title="' + group.name + '" data-room="' + group.id + '">';
    html += group.name + '</span>';
    html += '<span id="' + group.id + '" class="label label-success"></span></li>';
  });
  list.html(html);
}


// Checks that provided API key is valid
function testAuth(token) {
  var data = {
    token: token
  };

  var response = $.ajax({
    type: 'POST',
    url: 'https://slack.com/api/auth.test',
    data: data,
    async: false,
    success: function(data) {
      return data;
    }
  }).responseJSON;

  if (response.ok === true) {
    return response;
  } else {
    return false;
  }
}


// Gets authenticated user data from API
function getUserData(user) {
  var data = {
    token: slackToken,
    user: user
  };

  var response = $.ajax({
    type: 'POST',
    url: 'https://slack.com/api/users.info',
    data: data,
    async: false,
    success: function(data) {
      return data;
    }
  }).responseJSON;

  if (response.ok === true) {
    return response.user;
  } else {
    return false;
  }
}


// Gets active tab url
function postCurrentTabTo(channel) {
  chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT},function(tabs) {
    var tab = tabs[0];
    var tabUrl = tab.url;
    var formattedLink = '<' + tabUrl + '>';

    postMessage(formattedLink, channel);

  });
}


// Sends link to user or channel using Slack API
function postMessage(message, channel) {
  var data = {
    'token': slackToken,
    'channel': channel,
    'text' : message,
    'username': 'clicky from ' + user.name,
    'unfurl_links': true,
    'unfurl_media': true
  };

  $.ajax({
    type: 'POST',
    url: 'https://slack.com/api/chat.postMessage',
    data: data,
    success: function(data) {
      var badge = $('span#' + channel);
      if (data.ok === true) {      
        console.info('[info] Link shared');
        badge.siblings('.share-link').addClass('disabled');
        badge.removeClass('label-danger').addClass('label-success');        
        badge.html('Link shared!');
        badge.fadeIn();
        badge.delay(2000).fadeOut();
      } else {
        var errorMsgs = {
          'channel_not_found': 'Refresh and try again',
          'is_archived': 'Refresh and try again',
          'msg_too_long': 'Please try again',
          'no_text': 'Please try again',
          'rate_limited': 'Please try again',
          'not_authed': 'Please re-login',
          'invalid_auth': 'Please re-login',
          'account_inactive': 'Please re-login'
        };
        errorMsg = errorMsgs[data.error];
        console.error('[error] Error sharing link: ' + errorMsg);
        badge.removeClass('label-success').addClass('label-danger');
        badge.html('Error: ' + errorMsg);
        badge.fadeIn();
        badge.delay(2000).fadeOut();
        if (data.error == 'not_authed' || data.error == 'invalid_auth' || data.error == 'account_inactive') {
          localStorage.clear();
          loadView();
        };
      }          
    }
  });
}


// Builds greeting
function buildGreeting() {
  var greetings = [
    "Hello",
    "Hi",
    "Hiya",
    "Hey",
    "Ciao",
    "Sup",
    "Wha'gwan",
    "Hola",
    "Bonjour",
    "G'day",
    "What's Poppin'",
    "Howdy",
    "Aloha",
    "Namaste",
    "Salutations",
    "Wassup",
    "What's up",
    "Yo"
  ];
  var greetingId = Math.floor(Math.random() * greetings.length);
  var greeting = greetings[greetingId] + ', ' + user.profile.first_name + '!';
  $('#greeting').html(greeting);
  $('#title').css('color: #' + user.color);  
}



// Loads correct view based on available data
function loadView() {
  // Handles list hiding
  if (localStorage.getItem('clicky-hidden') === null) {
    var hiddenList = {
      'channelList' : false,
      'userList' : false,
      'groupList' : false
    }
    localStorage.setItem('clicky-hidden', JSON.stringify(hiddenList));
  } else {
    var hiddenList = JSON.parse(localStorage.getItem('clicky-hidden'));
    var keys = Object.keys(hiddenList);
    for (var i in keys) {
      if (hiddenList[keys[i]] === true) {
        var list = $('ul#' + keys[i]);
        list.hide();
        list.siblings('i').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
        list.parent('div').attr('data-visible', false);
      } 
    }
  }

  if (localStorage.getItem('clicky-token') !== null) {
    slackToken = localStorage.getItem('clicky-token');
    user = JSON.parse(localStorage.getItem('clicky-user'));
    if (localStorage.getItem('clicky-user') !== null) {
      user = JSON.parse(localStorage.getItem('clicky-user'));
      $('#api-token-view').hide();
      buildGreeting();
      getChannels();
      getUsers();
      getGroups();
      $('#main-view').show();      
    }

  } else {
    $('#main-view').hide();
    $('#api-token-view').show();
  }
}


// Deletes data in local storage and fetches new data from the Slack API
function refreshData() {
  console.info('[info] Refreshing data');
  localStorage.removeItem('clicky-users');
  localStorage.removeItem('clicky-channels');
  localStorage.removeItem('clicky-groups');
  console.info('[info] Local storage items removed');
  $('#userList').html('Loading...');
  $('#channelList').html('Loading...');
  $('#groupList').html('Loading...');  
  getChannels();
  getUsers();
  getGroups();
}


// Handles search and filters list of rooms
function filterRooms(str) {
  var matches = [];
  $('#resultList').html('');

  for (var i in rooms) {
    var room = rooms[i]
    if (room.name.indexOf(str) >= 0 && str != '') {
      matches.push(room);
    }
  }

  $('#rooms').hide();
  $('#search-results').show();
  // $('#search-form span.clear').show();
  for (var i in matches) {
    var match = matches[i];
    var html = '';
    html += '<li class="result"><span id="share-result" class="share-link" title="' + match.name + '" data-room="' + match.id + '">';
    html += match.name + '</span>';
    html += '<span id="' + match.id + '" class="label label-success"></span></li>';
    $('#resultList').append(html);
  }

  if (matches.length === 0 && str === '') {
    $('#rooms').show();
    $('#search-results').hide();
    $('#search-form span.clear').hide();
    $('#resultList').html(null);
  }
}


// Searches all rooms on keyup
$('#search-input').keyup(function() {
  var str = $('#search-input').val();
  filterRooms(str.toLowerCase());
});


// Clears search input on click
$(document).on('click', '#search-results-toggle', function() {
  filterRooms('');
  $('#search-input').val('');
});


// Handles API token form submit
$(document).on('click', '#clicky-token-submit', function() {
  var token = $('#clicky-token-input').val();
  var auth = testAuth(token);
  
  if (auth === false) {
    console.info('[info] Authenticated failed');
    $('#clicky-token-input').val('');
  } else {
    team = auth.team;
    slackToken = token;
    var user_id = auth.user_id;
    var authUser = getUserData(user_id);
    console.info('[info] Successfully authenticated as ' + authUser.profile.first_name + ' at ' + team);
    localStorage.setItem('clicky-user', JSON.stringify(authUser));
    localStorage.setItem('clicky-token', token);
    localStorage.setItem('clicky-team', team);
    loadView();
  }

});


// Handles link clicks
$(document).on('click', 'a.linkable', function() {
  var href = $(this).attr('href');
  chrome.tabs.create({'url': href});
});


// Handles click events on users, channels, and groups
// Shares active tab to that user/channel/group
$(document).on('click', '.share-link', function() {
  var channel = $(this).attr('data-room');
  if (!$(this).hasClass('disabled')) {
    postCurrentTabTo(channel);
  }
});


// Handles click events on refresh button
// Deletes users and channels from local storage
// Gets new data and rebuilds interfaces
$(document).on('click', '#refresh-data', function() {
  refreshData();
  var icon = $(this).find(".glyphicon-refresh");
  var animateClass = 'icon-refresh-animate';

  icon.addClass(animateClass);
  window.setTimeout( function() {
    icon.removeClass( animateClass );
  }, 1000 );  
});


// Handles list toggle clicks
$(document).on('click', '.list-toggle', function() {
  var icon = $(this);
  var room = icon.parent('div');
  var visible = room.attr('data-visible');
  var toggleId = icon.attr('data-toggle');
  var list = $('#' + toggleId);

  var visible = room.attr('data-visible') === 'true' ? true : false;

  var hiddenList = JSON.parse(localStorage.getItem('clicky-hidden'));

  if (visible == true) {
    list.slideUp(150);

    icon.addClass('icon-refresh-animate');
    window.setTimeout( function() {
      icon.removeClass('icon-refresh-animate glyphicon-chevron-up').addClass('glyphicon-chevron-down');
    }, 250 );

    room.attr('data-visible', false);
    hiddenList[toggleId] = true;
    localStorage.setItem('clicky-hidden', JSON.stringify(hiddenList));
  } else {
    list.slideDown(150);

    icon.addClass('icon-refresh-animate');
    window.setTimeout( function() {
      icon.removeClass('icon-refresh-animate glyphicon-chevron-down').addClass('glyphicon-chevron-up');
    }, 250 );

    room.attr('data-visible', true);
    hiddenList[toggleId] = false;    
    localStorage.setItem('clicky-hidden', JSON.stringify(hiddenList));
  }

});


// Google Analytics
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-56656365-1']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://stats.g.doubleclick.net/dc.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

$(document).on('click', '.share-link', function(e) {
  var id = e.target.id;
  var type = id.split('-')[1];
  _gaq.push(['_trackEvent', 'shareTo_' + type, 'clicked']);
});


// Loads views when document is ready
$(document).ready(function() {
  loadView();
});
