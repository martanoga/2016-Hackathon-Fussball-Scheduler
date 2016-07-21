var _ = require('underscore');
var fs = require('fs');
var config = require('../config');

var Data = {};

exports.getChannels = function (userId) {
  readDatabase();
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

exports.useOrCreateUser = function (userId, token) {
  readDatabase();
  var userIndex = _.findIndex(Data.Users, { id: userId });
  var added = false;
  if (userIndex === -1) {
    var added = true;
    Data.Users.push({ id: userId, token:token, channels: {} });
  }
  else{
    Data.Users[userIndex].token = token;
  }
  saveDatabase();
  console.log('User added');
  return added;
}

// {"id":"1","name":"fussball","event":{"state":0,"author":"","timeout":0,"maxUsers":4,"listOfUsers":[]}}
exports.createChannel = function (channelId, name, maxUsers) {
  readDatabase();
  var channelIndex = _.findIndex(Data.Channels, { id: channelId });
  var added = false;
  if (userIndex === -1) {
    var added = true;
    var channel = { id:channelId,name:name, event:{state:0,author:'',timeout:0,maxUsers:maxUsers,listOfUsers:[] } };
    Data.Channels.push(channel);
  }
  saveDatabase();
  console.log(added ? 'New channel added' : 'Channel exists');
  return added;
}

exports.startEvent = function (userId, channelId, timeout, maxUsers) {
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
  saveDatabase();
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
  console.log('User joined event');
  saveDatabase();

};

exports.getDataBaseContent = function () {
  readDatabase();
  return Data;
}

function saveDatabase () {
  fs.writeFileSync(config.getDBPath(),JSON.stringify(Data), 'utf8');
};

function readDatabase() {
  var path = config.getDBPath();
  var txt = fs.readFileSync(path,'utf8');
  Data = JSON.parse(txt);
};