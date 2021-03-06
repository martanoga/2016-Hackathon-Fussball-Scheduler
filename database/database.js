//{"Users":[{"id":"1235","channels":{"1":"1","2":"2"},"name":"Stanislaw","token":"1235"}],"Channels":[{"id":"1","name":"fussball","event":{"state":0,"author":"","timeout":0,"minUsers":4,"maxUsers":4,"listOfUsers":[]}},{"id":"2","name":"pizza","event":{"state":0,"author":"","timeout":0,"minUsers":1,//"maxUsers":1000,"listOfUsers":[]}}]}



var _ = require('underscore');
var fs = require('fs');
var config = require('../config');
var notifications = require('./notifications.js');

var Data = {};

exports.getChannels = function (userId) {
  readDatabase();
  var index = _.findIndex(Data.Users, { id: userId });
  if (index === -1) {
    return {};
  }

  var usersChannels = Data.Users[index].channels;

  var channels = _.map(Data.Channels, function (item) {

    var subscribers = 0;
    for (var k = 0; k < Data.Users.length; k++) {
      if (Data.Users[k].channels[item.id] !== undefined) {
        subscribers++;
      }
    }

    return {
      id: item.id,
      name: item.name,
      subscribed: usersChannels[item.id] !== undefined,
      eventInProgress: item.event.state,
      joined: _.findIndex(item.event.listOfUsers, { userId }) != -1,
      subscribersCount: subscribers
    };
  });
  return channels;
};

exports.getChannel = function (channelId) {
  readDatabase();

  var channelIndex = _.findIndex(Data.Channels, { id: channelId });
  if (channelIndex === -1) {
    return {};
  }

  var item = Data.Channels[channelIndex];

  var subscribers = 0;
  for (var k = 0; k < Data.Users.length; k++) {
    if (Data.Users[k].channels[item.id] !== undefined) {
      subscribers++;
    }
  }

  return {
    id: item.id,
    name: item.name,
    eventInProgress: item.event.state,
    joined: false,
    subscribersCount: subscribers
  };
};

exports.joinChannel = function (channelId, userId) {
  readDatabase();
  var userIndex = _.findIndex(Data.Users, { id: userId });

  if (userIndex === -1) {
    console.log('User needs to be created!');
    return false;
  }

  var channelIndex = _.findIndex(Data.Channels, { id: channelId });

  if (channelIndex === -1) {
    console.log('Channel needs to be created!');
    return false;
  }

  Data.Users[userIndex].channels[channelId] = channelId;
  saveDatabase();
  console.log('User joined channel');
  return true;
};

exports.useOrCreateUser = function (userId, name, photo, token) {
  readDatabase();
  var userIndex = _.findIndex(Data.Users, { id: userId });
  var added = false;
  if (userIndex === -1) {
    var added = true;
    Data.Users.push({ id: userId, name: name, photo: photo, token: token, channels: {} });
  }
  else {
    Data.Users[userIndex].token = token;
  }
  saveDatabase();
  console.log('User added');
  return added;
}

// {"id":"1","name":"fussball","event":{"state":0,"author":"","timeout":0,"maxUsers":4,"listOfUsers":[]}}
exports.createChannel = function (channelId, name, minUsers, maxUsers) {
  readDatabase();
  var channelIndex = _.findIndex(Data.Channels, { id: channelId });
  var added = false;
  if (channelIndex === -1) {
    channelIndex = _.findIndex(Data.Channels, { name: name });
    if (channelIndex === -1) {
      var added = true;
      var channel = { id: channelId, name: name, event: { state: 0, author: '', timeout: 0, minUsers: minUsers, maxUsers: maxUsers, listOfUsers: [] } };
      Data.Channels.push(channel);
    } else {
      Data.Channels[channelIndex].id = channelId;
      Data.Channels[channelIndex].event.minUsers = minUsers;
      Data.Channels[channelIndex].event.maxUsers = maxUsers;
    }
  }
  saveDatabase();
  console.log(added ? 'New channel added' : 'Channel exists');
  return added;
}

exports.startEvent = function (userId, channelId, timeout) {
  readDatabase();
  var userIndex = _.findIndex(Data.Users, { id: userId });
  if (userIndex === -1) {
    console.log('User needs to be created!');
    return false;
  }

  var channelIndex = _.findIndex(Data.Channels, { id: channelId });
  if (channelIndex === -1) {
    console.log('Channel needs to be created!');
    return false;
  }

  var channelName = Data.Channels[channelIndex].name;

  if (!Data.Users[userIndex].channels[channelId]) {
    console.log('User not subscribed to channel!');
    return false;
  }

  if (Data.Channels[channelIndex].event.state) {
    console.log('event already in progress');
    return false;
  }

  Data.Channels[channelIndex].event.state = 1;
  Data.Channels[channelIndex].event.author = userId;
  Data.Channels[channelIndex].event.timeout = timeout;
  Data.Channels[channelIndex].event.listOfUsers = [];
  Data.Channels[channelIndex].event.listOfUsers.push(userId);
  saveDatabase();

  notifications.sendEvent(channelName, JSON.stringify({ type: 'START' }));

  console.log('event started');
  return true;

};

exports.joinEvent = function (userId, channelId) {
  readDatabase();
  var userIndex = _.findIndex(Data.Users, { id: userId });
  if (userIndex === -1) {
    console.log('User needs to be created!');
    return false;
  }

  var channelIndex = _.findIndex(Data.Channels, { id: channelId });
  if (channelIndex === -1) {
    console.log('Channel needs to be created!');
    return false;
  }

  var channelName = Data.Channels[channelIndex].name;

  if (!Data.Users[userIndex].channels[channelId]) {
    console.log('User not subscribed to channel!');
    return false;
  }

  var event = Data.Channels[channelIndex].event;

  if (!event.state) {
    console.log('event not started yet');
    return false;
  }

  var userInEventIndex = _.findIndex(event.listOfUsers, userId);
  if (userInEventIndex !== -1) {
    console.log('User already participates!');
    return false;
  }

  event.listOfUsers.push(userId);
  console.log('User joined event');

  saveDatabase();
  return true;
};

function getEventStatus(index) {
  if (index >= Data.Channels.length || index < 0) {
    return null;
  }
  var event = Data.Channels[index].event;
  var timeOutPassed = event.timeout - Date.now() < 0;
  var nofUsers = event.listOfUsers.length;
  if (event.state != 1) {
    return 'NOTSTARTED';
  } else if (event.maxUsers <= nofUsers) {
    return 'HAPPENS';
  } else if (timeOutPassed) {
    return event.minUsers > nofUsers ? 'CANCELLED' : 'HAPPENS';
  } else {
    return 'INPROGRESS'
  }
}

function getEventUsers(index) {
  if (index >= Data.Channels.length || index < 0) {
    return [];
  }

  return _.map(Data.Channels[index].event.listOfUsers, function (item) {
    var userIndex = _.findIndex(Data.Users, { id: item });
    var user = Data.Users[userIndex];
    return {
      name: user.name,
      photo: user.photo
    };
  });
}

function closeFinishedEvent(index) {
  if (index != -1) {
    var status = getEventStatus(index);
    if (status === 'HAPPENS' || status === 'CANCELLED') {
      var evUsers = getEventUsers(index);
      Data.Channels[index].event.state = 0;
      Data.Channels[index].event.listOfUsers = [];
      Data.Channels[index].event.timeout = 0;
      Data.Channels[index].event.author = '';
      notifications.sendEvent(Data.Channels[index].name, JSON.stringify({ type: status, eventUsers: evUsers }));
    }
  }
};

exports.getDataBaseContent = function () {
  readDatabase();
  return Data;
}

readDatabase();
setInterval(function () {
  readDatabase();
  for (var i = 0; i < Data.Channels.length; i++) {
    closeFinishedEvent(i);
  }
  saveDatabase();
}, 2000);



function saveDatabase() {
  fs.writeFileSync(config.getDBPath(), JSON.stringify(Data), 'utf8');
};

function readDatabase() {
  var path = config.getDBPath();
  var txt = fs.readFileSync(path, 'utf8');
  Data = JSON.parse(txt);
};