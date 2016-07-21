var _ = require('underscore');
var fs = require('fs');
var config = require('../config');

var Data = {
  Users: [
    {
      id: '1235',
      channels: { '1': '1', '2': '2' },
      token: ''
    },
  ],
  Channels: [
    {
      id: '1',
      name: 'fussball',
      event: {
        state: 0, // ACTIVE = 1, 
        author: '',
        timeout: 0,
        maxUsers: 4,
        listOfUsers: []
      }
    },
    {
      id: '2',
      name: 'pizza',
      event: {
        state: 0, // ACTIVE = 1, 
        author: '',
        timeout: 0,
        maxUsers: 1000,
        listOfUsers: []
      }
    }
  ]
};


exports.getChannels = function (userId) {

  var index = _.findIndex(Data.Users, { id: userId });

  if (index === -1) {
    return {};
  }

  var usersChannels = Data.Users[index].channels;

  var channels = _.map(Data.Channels, function (item) {
    return {
      id: item.id,
      name: item.name,
      subscribed: usersChannels[item.id] !== undefined,
      eventInProgress: item.event.state
    };
  });
  return channels;
};


exports.joinChannel = function (channelId, userId) {

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

  return true;
};

exports.addUser = function (userId) {

  var userIndex = _.findIndex(Data.Users, { id: userId });
  if (userIndex === -1) {
    //   { id: '1235', channels: { '1': '1', '2': '2' } },
    Data.Users.push({ id: userId, channels: {} });
    return true;
  }
  return false;
}

exports.addTokenToUser = function (userId, token) {

  var userIndex = _.findIndex(Data.Users, { id: userId });
  if (userIndex !== -1) {
    Data.Users[userIndex].token = token;
    return true;
  }
  return false;
}

exports.startEvent = function (userId, channelId, timeout, maxUsers) {
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

  if (!Data.Users[userIndex].channels[channelId]) {
    console.log('User not subscribed to channel!');
    return false;
  }

  if (Data.Channels[channelIndex].event.state) {
    console.log('event already in progress');
    return false;
  }

  Data.Channels[channelIndex].event = {};
  Data.Channels[channelIndex].event.state = 1;
  Data.Channels[channelIndex].event.author = userId;
  Data.Channels[channelIndex].event.timeout = timeout;
  Data.Channels[channelIndex].event.maxUsers = maxUsers,
    Data.Channels[channelIndex].event.listOfUsers = [];
  Data.Channels[channelIndex].event.listOfUsers.push(userId);
  console.log('event started');
  return true;

};

exports.joinEvent = function (userId, channelId) {
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

  if (!Data.Users[userIndex].channels[channelId]) {
    console.log('User not subscribed to channel!');
    return false;
  }

  if (!Data.Channels[channelIndex].event.state) {
    console.log('event not started yet');
    return false;
  }

  var userInEventIndex = _.findIndex(Data.Channels[channelIndex].event.listOfUsers, userId);
  if (userInEventIndex !== -1) {
    console.log('User already participates!');
    return false;
  }

  Data.Channels[channelIndex].event.listOfUsers.push(userId);

};


//   newEvent: {
//     timeout: 1234567890123,
//     maxUsers: 1000,

//   }


// {
//   id: '2',
//   name: 'pizza',
//   event: {
//     state: 0, // ACTIVE = 1, 
//     author: '1235',
//     timeout: 1234567890123,
//     maxUsers: 1000,
//     listOfUsers: [
//       '1235',
//       '123456789'
//     ]
//   }



exports.saveUsersDatabase = function () {

  serialize(Data.Users, config.getUserDBPath());
}

exports.saveChannelsDatabase = function () {

  serialize(Data.Channels, config.getChannelsDBPath());
}


function serialize(obj, path) {
  var text = JSON.stringify(obj);
  fs.writeFile(path, text, { 'encoding': 'utf8' }, function (err) {
    if (err) {
      console.log(err);
    } else {

    }
  });
}

function deserialize(path) {
  fs.readFile(path, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      var obj = JSON.parse(data);
      return obj;
    }
  });
}


exports.getDataBaseContent = function () {
  return Data;
}