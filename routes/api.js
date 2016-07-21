var express = require('express');
var router = express.Router();

var session = require('express-session');

var database = require('../database/database.js');

router.get('/channels', function (req, res, next) {
  var userId = req.query.userId;
  var channels = database.getChannels(userId);
  res.send(JSON.stringify(channels));
});

router.post('/channels/join', function (req, res, next) {

  var channelId = req.body.channelId;
  var userId = getUserId(req);
  if (database.joinChannel(channelId, userId)) {
    res.send(200);
  } else {
    res.send(500);
  }
});

router.post('/channel/startevent', function (req, res, next) {
  var channelId = req.body.channelId;
  var timeout = req.body.timeout;
  var maxUsers = req.body.maxUsers;
  var userId = getUserId(req);
  if (database.startEvent(userId,channelId,timeout,maxUsers)) {
    res.send(200);
  } else {
    res.send(500);
  }
});

router.post('/channel/joinevent', function (req, res, next) {
  var channelId = req.body.channelId;
  var userId = getUserId(req);
  if (database.joinEvent(userId,channelId)) {
    res.send(200);
  } else {
    res.send(500);
  }
});

router.get('/token', function (req, res, next) {
  res.send(200, req.session.token);
});


// developer tools

router.get('/db', function (req, res, next) {
  res.send(database.getDataBaseContent());
});

router.post('/fake-login', function (req, res, next) {
  setUserId(req.body.userId,req);
  res.send(200); 
});


function setUserId(userId, req){
  database.addUser(userId);
  req.session.userId = userId;
  req.session.save();
  global.userId = req.session.userId;
}

function getUserId(req){
  return global.userId;
}

module.exports = router;
