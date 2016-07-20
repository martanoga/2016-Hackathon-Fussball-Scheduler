var _ = require('underscore');

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
      eventState: item.event.state
    };
  });
  return channels;
}


exports.joinChannel = function (channelId, userId) {

  var index = _.findIndex(Users, { id: userId });

  if (index === -1) {
    console.log('User needs to be created!');
    return false;
  }

  var indexChannel = _.findIndex(Channels, { id: channelId });

  if (indexChannel === -1) {
    return false;
  }

  Users[userId].channels[channelId] = channelId;

  return ture;
}


