var _ = require('underscore');
var fs = require('fs');

var Users = [
  {
    id: '1235',
    channels: { '1': '1', '2': '2' }
  },
  {
    id: '123456789',
    channels: { '1': '1', '2': '2' }
  },
  {
    id: '007',
    channels: { '2': '2' }
  },
  {
    id: '0001',
    channels: { }
  }
];

var Channels = [
  {
    id: '1',
    name: 'fussball',
    event: {
      state: 0, // ACTIVE = 1, 
      aurhor: '1235',
      timeout: 1234567890123,
      maxUsers: 4,
      listOfUsers: [
        '1235'
      ]
    }
  },
  {
    id: '2',
    name: 'pizza',
    event: {
      state: 0, // ACTIVE = 1, 
      aurhor: '1235',
      timeout: 1234567890123,
      maxUsers: 1000,
      listOfUsers: [
        '1235',
        '123456789'
      ]
    }
  }
];


exports.getChannels = function (userId) {

  var index = _.findIndex(Users, { id: userId });

  if (index === -1) {
    return {};
  }

  var usersChannels = Users[index].channels;

  var channels = _.map(Channels, function (item) {
    return {
      id: item.id,
      name: item.name,
      subscribed: usersChannels[item.id] !== undefined,
      eventInProgress: item.event.state
    };
  });
  return channels;
}


exports.joinChannel = function (channelId, userId) {

  var userIndex = _.findIndex(Users, { id: userId });

  if (userIndex === -1) {
    console.log('User needs to be created!');
    return false;
  }

   var channelIndex = _.findIndex(Channels, { id: channelId });

  if (channelIndex === -1) {
    console.log('Channel needs to be created!');
    return false;
  }

  Users[userIndex].channels[channelId] = channelId;

  return true;
}

exports.serialize = function (obj, dest) {
  var text = JSON.stringify(obj);
  fs.writeFile(dest, text, { 'encoding': 'utf8' }, function (err) {
    if (err) {
      console.log(err);
    } else {

    }
  });
}

exports.deserialize = function (source) {
  fs.readFile(source, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      var obj = JSON.parse(data);
      return obj;
    }
  });
}
