//https://developer-stg.api.autodesk.com/authentication/v1/authenticate

var config = {
  ADSK_PATH_START : 'https://developer',
  ADSK_PATH_END : '.api.autodesk.com',
  ADSK_SERVER : '', //-stg
  ADSK_VERSION : 'v1',

}

exports.getADSKAuthPath = function () {
  return config.ADSK_PATH_START + config.ADSK_SERVER + config.ADSK_PATH_END + '/authentication/' + config.ADSK_VERSION + '/authorize';
};

exports.getADSKGetTokenPath = function () {
  return config.ADSK_PATH_START + config.ADSK_SERVER + config.ADSK_PATH_END + '/authentication/' + config.ADSK_VERSION + '/gettoken';
};

exports.getADSKGetUserInfoPath = function () {
  return config.ADSK_PATH_START + config.ADSK_SERVER + config.ADSK_PATH_END + '/userprofile/' + config.ADSK_VERSION + '/users/@me';
};