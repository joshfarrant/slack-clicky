var slackToken = 'SLACK_API_TOKEN';
var user = JSON.parse(localStorage.getItem('clicky-user'));

function getChannels() {
  var data = {
    'token': slackToken,
    'exclude_archived': 1
  }

  if (localStorage.getItem('clicky-channels') === null) {
    $.ajax({
      type: 'POST',
      url: 'https://slack.com/api/channels.list',
      data: data,
      success: function(data) {
        var channels = data.channels;
        localStorage.setItem('clicky-channels', JSON.stringify(channels));
        buildChannelList(channels);
      }
    });
  } else {
    var channelsJson = localStorage.getItem('clicky-channels');
    channels = JSON.parse(channelsJson);
    buildChannelList(channels);
  }
}


function getUsers() {
  var data = {
    'token': slackToken
  }

  if (localStorage.getItem('clicky-users') === null) {
    $.ajax({
      type: 'POST',
      url: 'https://slack.com/api/users.list',
      data: data,
      success: function(data) {
        var users = data.members;
        localStorage.setItem('clicky-users', JSON.stringify(users));
        buildUserDropdown();
        buildUserList(users);
      }
    });
  } else {
    var usersJson = localStorage.getItem('clicky-users');
    users = JSON.parse(usersJson);
    buildUserList(users);
  }
}


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
    success: function() {
      console.info('[info] Link shared');
    }
  });
}


function postCurrentTabTo(channel) {

  chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT},function(tabs) {
    var tab = tabs[0];
    var tabUrl = tab.url;
    var formattedLink = '<' + tabUrl + '>';

    postMessage(formattedLink, channel);

  });
}


function buildChannelList(channels) {
  var list = $('#channelList');
  var html = '';
  $.each(channels, function(i) {
    var channel = channels[i];
    html += '<li class="channel"><a href="#" title="' + channels[i].purpose.value + '" data-room="' + channel.id + '">#';
    html += channel.name + '</a>';
    html += '</li>';
  });
  list.html(html);
}


function buildUserList(users) {
  var list = $('#userList');
  var html = '';
  $.each(users, function(i) {
    var user = users[i];
    html += '<li class="user"><a href="#" title="' + users[i].profile.real_name + '" data-room="' + user.id + '">' + user.name + '</a></li>';
  });
  list.html(html);
}


function buildUserDropdown() {

  var usersJson = localStorage.getItem('clicky-users');
  users = JSON.parse(usersJson);
  var html = '';
  for (var i in users) {
    var name = users[i].name;
    html += '<li class="user"><a href="#">' + name + '</a></li>';    
  }
  $('#user-select').html(html);
}


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
}


function loadView() {
  if (localStorage.getItem('clicky-user') !== null) {
    user = JSON.parse(localStorage.getItem('clicky-user'));
    $('#login-view').hide();
    $('#main-view').show();
    buildGreeting();
    getChannels();
    getUsers();
  } else {
    getUsers();
    buildUserDropdown();
  }
}


$(document).on('click', '.roomList>li>a', function() {
  var channel = $(this).attr('data-room');
  postCurrentTabTo(channel);
});


$(document).on('click', '#user-select>.user>a', function() {
  var name = $(this).html();
  var usersJson = localStorage.getItem('clicky-users');
  var users = JSON.parse(usersJson);
  for (var i in users) {
    if (users[i].name == name) {
      localStorage.setItem('clicky-user', JSON.stringify(users[i]))
      loadView();
      break;
    }
  }
});


$(document).on('click', '#refresh-data', function() {
  console.info('[info] Refreshing data');
  localStorage.removeItem('clicky-users');
  localStorage.removeItem('clicky-channels');
  console.info('[info] Local storage items removed');
  $('#userList').html('Loading...');
  $('#channelList').html('Loading...');
  getChannels();
  getUsers();
});


$(document).ready(function() {
  loadView();
});
