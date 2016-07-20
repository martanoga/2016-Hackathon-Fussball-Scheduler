var _ = require('underscore');

var Users = [
  {
    id: '1235',
    channles: ['1', '2']
  },
  {
    id: '123456789',
    channles: ['1', '2']
  },
  {
    id: '007',
    channles: ['2']
  }
];

var Channles = [
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

  var index = _.indexOf(Users, function (item) {
    return item.id === userId;
  });

  var usersChannels = Users[index].channels;

  var channels = _.map(Channels, function (item) {
    return {
      id : item.id,
      name : item.name,
      subscribed : _.indexOf(usersChannels, item.id) > 0,
      eventState : item.event.state
    };
  });
  return channels;
}