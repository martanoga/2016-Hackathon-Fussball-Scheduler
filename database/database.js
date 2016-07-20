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
      author: '1235',
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
      author: '1235',
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
};


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
};

exports.addUser = function(userId){
  
  var userIndex = _.findIndex(Users, { id: userId });
  if (userIndex === -1) {
    //   { id: '1235', channels: { '1': '1', '2': '2' } },
    Users.push({id: userId, channels: {}});
    return true;
  }
  return false;
}


exports.startEvent = function(userId,channelId,newEvent){
  var userIndex = _.findIndex(Users, { id: newEvent.author });
  if (userIndex === -1) {
    console.log('User needs to be created!');
    return false;
  }

  var channelIndex = _.findIndex(Channels, { id: channelId });
  if (channelIndex === -1) {
    console.log('Channel needs to be created!');
    return false;
  }

  if( Users[newEvent.author].channels[channelId] && !Channels[channelIndex].event.state){
    Channels[channelIndex].event = newEvent;
    Channels[channelIndex].event.state = 1;
    Channels[channelIndex].event.author = userId;
    Channels[channelIndex].event.listOfUsers = [];
  }
  else {
    console.log('event is already in progress');
    return false;
  }
};

exports.joinEvent = function(channelId){
  var userIndex = _.findIndex(Users, { id: newEvent.author });
  if (userIndex === -1) {
    console.log('User needs to be created!');
    return false;
  }

  var channelIndex = _.findIndex(Channels, { id: channelId });
  if (channelIndex === -1) {
    console.log('Channel needs to be created!');
    return false;
  }

  if( Users[newEvent.author].channels[channelId] && Channels[channelIndex].event.state){
    Channels[channelIndex].event.listOfUsers.push(userId);
  }
  else {
    console.log('event not started yet');
    return false;
  }
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
