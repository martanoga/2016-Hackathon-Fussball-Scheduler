var config = require('../config');

exports.sendEvent = function (channelName, text) {

  var url = config.getADSKChannelPath() + '/' + channelName;
  var accessToken = global.token;

  request.post({
    url: url,
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    data: JSON.stringify({
      message: JSON.stringify({
        type: text,
        text: text
      })
    })
  },
    function (error, response, body) {
      if (error) {
        response.statusCode = 400;
      } else {

      }
    }
  );
};

