var bytes = require('pretty-bytes');
var dataUsage = require('../index').create({
  connectionNumber: 114123456,
  type: 'LTE',
  interval: 5000,
});

dataUsage.once('finished', function(info){
  console.log(info.packageName);
});
