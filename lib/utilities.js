//var request = require('request');
var bytes = require('bytes');
var date = require('moment');
var utilities = module.exports;
var request = require('superagent');
var debug = require('debug')('dialog-data-usage:utilities');

utilities.getDataUsage = function(connectionNumber, type, callback) {

  debug('Creating request to Dialog CCAPP API with connection number ' + connectionNumber + ' and lob set to ' + type);
  request.post('https://ccapp.dialog.lk/scapp_4_0/index.php?r=/scapp/data/getDataUsage')
    .type('form')
    .send({
      connRef: connectionNumber, // Phone number
      lob: type, // "mobile", "LTE"
      nic: '' // It need this parameter, but doesn't validate it.
    })
    .end(function(error, response) {
      if (!error && response.statusCode == 200) {
        debug('Raw response from server:', response.text);
        var parsedBody = JSON.parse(response.text);
        if (parsedBody.success) {
          parsedBody.clean = parsedBody.data.map(function(package) {
            return {
              quotaId: (
                function() {
                  if (package.name === 'Any Time Data') return 'day-time-data';
                  if (package.name === 'Night Time Data (12 midnight - 8 a.m)') return 'night-time-data';
                  if (package.name === 'Data Extension') return 'extension-data';
                }
              )(),
              packageCode: package.code,
              packageName: package.name,
              totalQuota: bytes(package.qtainitval),
              usedQuota: bytes(package.qtausage),
              balanceQuota: bytes(package.qtabal),
              expiryDate: date(package.expiredate, 'YYYY/MM/DD').toDate()
            };
          });
          debug("Got response", parsedBody.clean);
          callback(error, parsedBody.clean);
        } else {
          debug('An error occured:', response.statusCode, error);
          callback(new Error('Data seem to be invalid'), null);
        }
      }
    });
};

utilities.getDataUsageHistory = function(connectionNumber, type, callback) {
  request.post('https://ccapp.dialog.lk/scapp_4_0/index.php?r=/scapp/data/getLteDataUsageByDate')
    .type('form')
    .send({
      conn: connectionNumber, // Phone number
      lob: type, // "mobile", "LTE"
      nic: '' // It need this parameter, but doesn't validate it.
    })
    .end(function(error, response) {
      if (!error && response.statusCode == 200) {

        var parsedBody = JSON.parse(response.text);
        if (parsedBody.success) {
          parsedBody.clean = parsedBody.data.map(function(entry) {
            return {
              quotaID: (
                function() {
                  if (entry.quota_name === 'Any Time') return 'day-time-data';
                  if (entry.quota_name === 'Night Time') return 'night-time-data';
                  if (entry.quota_name === 'Extension') return 'extension-data';
                }
              )(),
              packageName: entry.quota_name,
              date: date(entry.timeDate.replace(/\//g, '-'), 'DD-MM-YYYY').toDate(),
              usedQuota: bytes(entry.quota_usage),
              balanceQuota: bytes(entry.quota_balance)
            };
          });
          callback(error, parsedBody.clean);
        } else {
          callback(new Error('Data seem to be invalid'), null);
        }
      }
    });
};
