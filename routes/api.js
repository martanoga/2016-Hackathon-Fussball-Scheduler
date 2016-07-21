var express = require('express');
var router = express.Router();

var database = require('../database/database.js');

router.get('/channels', function (req, res, next) {

  var userId = getUserId(req);
  var channels = database.getChannels(userId);
  if (Object.keys(channels).length === 0) {
    res.send(401);
  } else {
    res.send(JSON.stringify(channels));
  }
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

router.post('/channel/unjoin', function (req, res, next) {

  // var channelId = req.body.channelId;
  // var userId = getUserId(req);
  // if (database.unjoinChannel(channelId, userId)) {
  //   res.send(200);
  // } else {
  //   res.send(500);
  // }
});

router.post('/channel/startevent', function (req, res, next) {
  var channelId = req.body.channelId;
  var timeout = req.body.timeout;
  timeout = Date.now() + timeout * 60 * 1000;
  var minUsers = req.body.minUsers;
  var maxUsers = req.body.maxUsers;
  var userId = getUserId(req);
  if (database.startEvent(userId, channelId, timeout, minUsers, maxUsers)) {
    res.send(200);
  } else {
    res.send(500);
  }
});

router.post('/channel/joinevent', function (req, res, next) {
  var channelId = req.body.channelId;
  var userId = getUserId(req);
  if (database.joinEvent(userId, channelId)) {
    res.send(200);
  } else {
    res.send(500);
  }
});

router.post('/channel/unjoinevent', function (req, res, next) {
  // var channelId = req.body.channelId;
  // var userId = getUserId(req);
  // if (database.unjoinEvent(userId, channelId)) {
  //   res.send(200);
  // } else {
  //   res.send(500);
  // }
});

// developer tools

router.get('/db', function (req, res, next) {
  res.send(database.getDataBaseContent());
});

function getUserId(req) {
  return req.query.userId;
}

module.exports = router;
