var bytes = require('pretty-bytes');
var dataUsage = require('../index').create({
  connectionNumber: 0114187711,
  type: 'LTE',
  interval: 5000,
});

dataUsage.getDataUsage(function(error, data){
  console.log(data);
});

//dataUsage.getDataUsageHistory(function(error, data){
//  console.log(data);
//});
