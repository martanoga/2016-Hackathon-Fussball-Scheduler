var express = require('express');
var router = express.Router();

var database = require('../database/database.js');

router.get('/channels', function (req, res, next) {
  var user = req.query.user;
  var channels = database.getChannels(user);
  res.send(JSON.stringify(channels));
});

router.post('/channels', function (req, res, next) {
  var channel = req.data.channel;

});

router.post('/channel/startevent' , function (req, res, next) {
  
});

router.post('/channel/joinevent' , function (req, res, next) {
  
});

module.exports = router;
