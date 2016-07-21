var config = require('../config');

exports.eventHappens = function (channelName) {

//   var url = config.getADSKChannelPath() + '/' + channelName;
//   var accessToken = global.token;
//   var text = "Event happens!"

//   request.post({
//     url: url,
//     headers: {
//       'Authorization': 'Bearer ' + accessToken,
//       'Content-Type': 'application/json',
//       'Access-Control-Allow-Origin': '*'
//     },
//     body: JSON.stringify({
//       message: JSON.stringify({
//         type: 'New Comment',
//         text: text
//       })
//     })
//   },
//     function (error, response, body) {
//       if (error) {
//         response.statusCode = 400;
//       } else {
//         if (response.statusCode === 409) {
//           //already exists
//         } else {
//           response.statusCode = 200;
//           var channelId = body.channelId;
//           database.createChannel(channelId, channelName, maxUsers);
//         }
//       }
//     }
//   );


//   $.ajax({
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     method: 'POST',
//     url: url,
//     beforeSend: attachToken,
//     data: JSON.stringify({
//       message: JSON.stringify({
//         type: 'New Comment',
//         text: text
//       })
//     })
//   }).done(function (msg) {
//     console.log('Done ', msg);
//   }).fail(function (jqXHR, textStatus) {
//     console.log('Fail', textStatus, jqXHR);
//   });
// };

// exports.eventStart = function () {


};


exports.eventCancel = function () {


};

