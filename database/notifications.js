var config = require('../config');
var request = require('request');

exports.sendEvent = function (channelName, text) {

  var url = config.getADSKChannelPath() + '/' + channelName;
  var accessToken = global.token;
  var body_ = JSON.stringify({message: text});

  request.post({
    url: url,
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: body_
  },
    function (error, response, body) {
      if (error) {
        response.statusCode = 400;
      } else {

      }
    }
  );
};

