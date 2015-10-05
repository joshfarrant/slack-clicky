var activePings = [];
var socket;
var firstMsgReceived = false;

function getParams(url) {
  var paramsObj = {};
  var splitUrl = url.split('?');
  var paramString = splitUrl[1];
  var params = paramString.split('&');
  for (var i in params) {
    var param = params[i];
    var array = param.split('=');
    var key = array[0];
    var value = array[1];
    paramsObj[key] = value;
  }
  return paramsObj;
}

// Gets authenticated user data from API
function getUserData(user, token) {
  var data = {
    token: token,
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

// Gets authenticated team data from API
function getTeamData(token) {

  var response = $.ajax({
    type: 'GET',
    url: 'https://slack.com/api/team.info',
    data: {
      token: token
    },
    async: false,
    success: function(data) {
      return data;
    }
  }).responseJSON;

  if (response.ok === true) {
    return response.team;
  } else {
    return false;
  }
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


// Submits and tests entered API token
function submitToken(token) {
  var auth = testAuth(token);

  if (auth === false) {
    console.info('[info] Authenticated failed');
    return false;
  } else {
    var team = auth.team;
    var user_id = auth.user_id;
    var authUser = getUserData(user_id, token);
    var authTeam = getTeamData(token);
    localStorage.setItem('clicky-user', JSON.stringify(authUser));
    localStorage.setItem('clicky-team-info', JSON.stringify(authTeam));
    localStorage.setItem('clicky-token', token);
    localStorage.setItem('clicky-team', team);
    beginStream();

    chrome.extension.sendRequest({
      msg: 'refreshView'
    });
    return true;
  }
}


function exchangeSlackCode(data) {

  $.ajax({
    type: 'POST',
    url: 'https://slack.com/api/oauth.access',
    data: data,
    success: function(data) {
      if (data.ok === true) {
        submitToken(data.access_token);
      }
    }
  });
}


function generateState() {

  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i=0; i < 5; i++){
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;

}


function beginStream(callback) {

  var token = localStorage.getItem('clicky-token');

  console.log('Connecting to stream');

  if (!localStorage.getItem('clicky-team-info')) {

    var team = getTeamData(token);
    localStorage.setItem('clicky-team-info', JSON.stringify(team));

  }


  $.ajax({
    type: 'GET',
    url: 'https://slack.com/api/rtm.start',
    data: {
      token: token
    },
    success: function(data) {
      if (data.ok === true) {
        if (socket) socket.close();
        connectToStream(data.url, callback);
      } else {
        console.log('Error starting rtm: ', data);
        localStorage.removeItem('clicky-token');
      }
    }
  });

}


function connectToStream(url, callback) {

  socket = new WebSocket(url);

  socket.onopen = function(event) {

    console.log('Connected to stream');
    localStorage.setItem('clicky-pending-msgs', JSON.stringify({}) );
    localStorage.setItem('clicky-errors', JSON.stringify({}) );

    if (callback) {
      callback();
    }

    // Remove context menus, then rebuild them
    chrome.contextMenus.removeAll(buildContextMenus);

  };

  socket.onmessage = function(event) {

    var message = JSON.parse(event.data);
    console.log(message);

    if (!firstMsgReceived && message.type == 'message') {
      firstMsgReceived = true;
      return;
    }

    var pendingMsgs = JSON.parse( localStorage.getItem('clicky-pending-msgs') );

    if (message.type == 'pong') {

      // Checks to see if unresolved pings exist
      // And if pong is in response to one of them
      if (activePings.length > 0 && activePings.indexOf(message.reply_to) > -1) {

        // If pong is in response to an active ping, all active pings are cleared
        activePings = [];
        console.log('Pong!', message.reply_to);

      }

    } else if (message.type == 'message') {
      // If the first 7 characters of a string match '#Clicky'
      // The message is assumed to contain a #Clicky, and could display a notification

      if (message.text && message.text.substring(0, 5) == '<http') {

        if (message.user !== JSON.parse(localStorage.getItem('clicky-user')).id) {

          console.log('Incoming #Clicky!');

          var text = message.text;
          var link = text.substring(text.lastIndexOf("<") + 1, text.lastIndexOf(">"));

          if (JSON.parse(localStorage.getItem('clicky-settings')).notifications) {
            createNotification(link, message.channel, message.ts);
          }

        }

      }

    } else if (pendingMsgs[message.reply_to]) {

      var channel = pendingMsgs[message.reply_to].channel;

      if (message.ok === true) {

        chrome.extension.sendRequest({
          msg: 'setBadgeSuccess',
          id: channel,
          ts: message.ts
        });

        delete pendingMsgs[message.reply_to];
        localStorage.setItem('clicky-pending-msgs', JSON.stringify(pendingMsgs));

      } else {

        chrome.extension.sendRequest({
          msg: 'setBadgeError',
          id: channel,
          error: message.error.msg
        });

        var errors = JSON.parse( localStorage.getItem('clicky-errors') );

        errors[message.reply_to] = message.error;

        localStorage.setItem('clicky-errors', JSON.stringify(errors));

      }

    }

  };

  socket.onerror = function(error) {

    console.log('Stream error: ', error);
    sendPing();

  };

  socket.onclose = function() {

    console.log('Stream closed');
    chrome.contextMenus.removeAll();

  };

}


function addToHistory() {

}


function sendPing() {

  var id = generateId();
  var data = {
    id: id,
    type: 'ping'
  };

  activePings.push(id);

  console.log('Ping! ', id);

  // Send ping
  socket.send(JSON.stringify(data));

  // Wait 10 seconds
  setTimeout(function() {

    if (activePings.length > 0 && activePings.length < 3) {

      // If either 1 or 2 pings are still active, send another ping
      sendPing(socket);

    } else if (activePings.length >= 3) {

      console.log('Uh oh ping-y-oh');

      // If 3 pings are active stream is assume dead and is closed
      socket.close();
      beginStream();

    }

    // If number of active pings is 0, that indicates a pong has been recieved
    // In this case no further action is required

  }, 10000);

}


function generateId() {
  return Math.floor(Math.random() * 9000000) + 1000000;
}


function getChannelName(id) {
  return JSON.parse(localStorage.getItem('clicky-roomIds'))[id];
}

function getChannelType(id) {
  var name = getChannelName(id);
  var type;

  switch (name[0]) {
    case '@':
      type = 'user';
      break;
    case '#':
      type = 'channel';
      break;
    default:
      type = 'group';
      break;
  }

  return type;
}


function createNotification(link, user, ts) {

  var title = '#Clicky from ' + getChannelName(user);

  var options = {
    type: 'basic',
    iconUrl: 'assets/icon128.png',
    title: title,
    message: '',
    contextMessage: link,
    isClickable: true,
    buttons: [
      {title: 'Open link'}
    ]
  };

  var notificationData = {
    link: link,
    channel: user,
    ts: ts
  };

  chrome.notifications.create(notificationId='', options=options, function(id) {
    localStorage.setItem(id, JSON.stringify(notificationData));
  });
}


function postMessage(url, channel, search, text) {

  var formattedMessage;
  var metadata;

  console.log('');
  console.log('socket: ', socket);
  console.log('');

  if (socket.readyState !== 1) {
    console.log('Socket not open: ', socket);
    beginStream(function() {
      postMessage(url, channel, search, text);
    });
  }

  formattedMessage = text ? (text + ' ' + url) : url;

  var id = generateId();
  var data = {
    id: id,
    type: 'message',
    channel: channel,
    text: formattedMessage
  };

  try {
    socket.send(JSON.stringify(data));

    var history = JSON.parse(localStorage.getItem('clicky-history'));
    var rooms = JSON.parse(localStorage.getItem('clicky-roomIds'));

    var timestamp = new Date().getTime() / 1000;
    var roundedTimestamp = Math.floor(timestamp);

    var historyEntry = {
      id: id,
      url: url,
      to: rooms[channel],
      timestamp: roundedTimestamp
    };

    history.push(historyEntry);
    localStorage.setItem('clicky-history', JSON.stringify(history));

  } catch(err) {

    console.log('Error sending message: ', err);
    beginStream();

  }

  var pendingMsgs = JSON.parse( localStorage.getItem('clicky-pending-msgs') );
  pendingMsgs[id] = {
    channel: channel,
    text: formattedMessage
  };
  localStorage.setItem('clicky-pending-msgs', JSON.stringify(pendingMsgs));

}


function beginOAuth() {

  $.ajax({
    type: 'GET',
    url: '/config.json',
    success: function(json) {

      var data = JSON.parse(json);
      var b = {_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",e:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=b._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64;}else if(isNaN(i)){a=64;}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a);}return t;},d:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r);}if(a!=64){t=t+String.fromCharCode(i);}}t=b._utf8_decode(t);return t;},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128);}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128);}}return t;},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++;}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2;}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3;}}return t;}};
      var j = b.d(data.c);
      var d = JSON.parse(j);

      var state = generateState();
      var url = 'https://slack.com/oauth/authorize';
      url += '?client_id=' + d.client_id;
      url += '&state=' + state;
      url += '&scope=identify,read,post,client';

      var options = {
        'interactive': true,
        'url': url
      };

      chrome.identity.launchWebAuthFlow(options, function(redirectUrl) {
        var params = getParams(redirectUrl);
        if (params.state == state) {
          d.code = params.code;
          exchangeSlackCode(d);
        }
      });

    }
  });

}


function markMessageRead(room, ts) {

  var token = localStorage.getItem('clicky-token');
  var roomIds = JSON.parse( localStorage.getItem('clicky-roomIds') );
  var roomName = roomIds[room];

  var url;

  switch (roomName.substring(0,1)) {
    case '@':
      url = 'https://slack.com/api/im.mark';
      break;
    case '#':
      url = 'https://slack.com/api/channels.mark';
      break;
    default:
      url = 'https://slack.com/api/groups.mark';
      break;
  }

  var data = {
    token: token,
    channel: room,
    ts: ts
  };

  $.ajax({
    type: 'POST',
    url: url,
    data: data,
    async: false,
    success: function(data) {

      if (data.ok) {
        console.info('Messaged marked as read');
      }

    }
  });

}


function clearNotifications() {

  var toDelete = [];

  for (var i = 0; i < localStorage.length; i++){
    var key = localStorage.key(i);

    if (key.substring(0, 6) !== 'clicky') {
      toDelete.push(key);
    }
  }

  for (var j in toDelete) {
    var item = toDelete[j];
    localStorage.removeItem(item);
  }

}

function buildContextMenus() {

  var rooms = JSON.parse(localStorage.getItem('clicky-roomIds'));

  var ids = Object.keys(rooms);

  if (ids.length > 20) {
    return;
  }

  for (var i in ids) {

    var id = ids[i];
    var room = rooms[id];

    var title = room;

    chrome.contextMenus.create({
      'id': id,
      'title': title,
      'contexts': ['selection'],
      'onclick': function(info, tab) {

        var clickedId = info.menuItemId;
        var selected = info.selectionText;

        var url = tab.url;

        var message = '>_"' + selected + '"_ - ' + url;

        postMessage(message, clickedId);

      }
    });

  }

}


// Listens for messages sent from app.js
chrome.extension.onRequest.addListener(function(request,sender,sendResponse) {

  switch (request.msg) {
    case 'refresh':
      beginStream();
      break;
    case 'beginOAuth':
      beginOAuth();
      break;
    case 'postMessage':
      postMessage(request.url, request.channel, request.search, request.text);
      break;
    case 'submitToken':
      submitToken(request.token);
      break;
    default:
      break;
  }

});


chrome.notifications.onButtonClicked.addListener(function(id) {

  if ( localStorage.getItem(id) ) {

    var json = localStorage.getItem(id);
    var data = JSON.parse(json);
    var link = data.link;
    var ts = data.ts;
    var room = data.channel;

    localStorage.removeItem(id);
    chrome.tabs.create({'url': link});
    markMessageRead(room, ts);

  }

});


chrome.notifications.onClosed.addListener(function(id) {
  localStorage.removeItem(id);
  console.info('Notification closed: ' + id);
});


beginStream();
clearNotifications();

if (!localStorage.getItem('clicky-created')) {
  var timestamp = Math.floor(Date.now() / 1000);
  localStorage.setItem('clicky-created', timestamp);
}
