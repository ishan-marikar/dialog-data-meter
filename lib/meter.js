var EventEmitter = require('events').EventEmitter;
var utilities = require('./utilities');
var util = require('util');

function DialogDataUsage(options) {
  if (!(this instanceof DialogDataUsage)) {
    return new DialogDataUsage(DialogDataUsage);
  }
  this.options = options;
  if (!options) {
    throw new Error('You must pass in an options dictionary.');
  }
  this.iterator = null;
  EventEmitter.call(this);
}

util.inherits(DialogDataUsage, EventEmitter);
var API = DialogDataUsage.prototype;

API.listen = function() {
  /*
    TODO: Return only the package that changed, as opposed to returning the
    entire the array of packages.
  */
  var that = this;
  var previousData = [];
  this.iterator = setInterval(function() {

    utilities.getDataUsage(
      that.options.connectionNumber,
      that.options.type,
      function(error, data) {
        data.forEach(function(package) {
          if (package.balanceQuota <= 0) {
            that.emit('finished', package);
          }
          if (
            that.options.limit > ((package.usedQuota / package.totalQuota) * 100)
          ) {
            that.emit('limit', package);
          }
          if (Object.keys(previousData).length >= data.length) {
            if (package.usedQuota > previousData[package.quotaId].usedQuota) {
              that.emit('update', package);
            }
          } else {
            if (!that.options.disableInitialValues) that.emit('update', package);
          }
          previousData[package.quotaId] = package;
        });
      });

  }, that.options.interval);

};

API.getDataUsage = function(callback) {
  return utilities.getDataUsage(
    this.options.connectionNumber,
    this.options.type,
    callback);
};

API.getDataUsageHistory = function(callback) {
  return utilities.getDataUsageHistory(
    this.options.connectionNumber,
    this.options.type,
    callback);
};

var create = function(options) {
  return new DialogDataUsage(options);
};

module.exports = DialogDataUsage;
module.exports.create = create;
