var bytes = require('pretty-bytes');
var dataUsage = require('../index').create({
  connectionNumber: 0114187711,
  type: 'LTE',
  interval: 5000,
  disableInitialValues: false
});

dataUsage.getDataUsageHistory(function(error, data){
  console.log(data);
});
