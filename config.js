//https://developer-stg.api.autodesk.com/authentication/v1/authenticate
var fs = require('fs');
var fse = require('fs-extra');


var config = {
  ADSK_PATH_START : 'https://developer',
  ADSK_PATH_END : '.api.autodesk.com',
  ADSK_SERVER : '', //-stg
  ADSK_VERSION : 'v1',

  DB : './database/storage/data.json',
  DB_TMPL : './database/storage/data.template.json',
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

exports.getDBPath = function () {
  try {
      fs.accessSync(config.DB, fs.F_OK);
  } catch (e) {
      fse.copySync(config.DB_TMPL, config.DB);
  }
  return config.DB;
};