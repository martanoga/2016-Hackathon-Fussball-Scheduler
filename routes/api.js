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

router.post('/fake-registration', function (req, res, next) {
  req.session.userId = req.body.userId;
  req.session.save(); 
  global.userId = req.session.userId;
  res.send(200); 
});

router.post('/channel/startevent', function (req, res, next) {

});

router.post('/channel/joinevent', function (req, res, next) {

});


function getUserId(req){
  return global.userId;
}

module.exports = router;
