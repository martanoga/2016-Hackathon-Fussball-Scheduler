var express = require('express');
var router = express.Router();

var database = require('../database/database.js');

router.get('/channels', function (req, res, next) {
  var userId = req.query.userId;
  var channels = database.getChannels(userId);
  res.send(JSON.stringify(channels));
});

router.post('/channels/join', function (req, res, next) {
  var channelId = req.data.channelId;
  var userId = "007";// req.data.userId;
  if (database.joinChannel(channelId, userId)) {
    res.send(200);
  } else {
    res.send(500);
  }
});

router.post('/channel/startevent', function (req, res, next) {

});

router.post('/channel/joinevent', function (req, res, next) {

});

module.exports = router;
