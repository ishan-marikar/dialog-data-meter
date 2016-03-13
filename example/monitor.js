var bytes = require('pretty-bytes');
var dataUsage = require('../index').create({
  connectionNumber: 114123456,
  type: 'LTE',
  interval: 5000,
});

dataUsage.listen();
var number = 0;
dataUsage.on('update', function(info){
  process.stdout.write('\033c');
  console.log('Iteration:', number++);
  console.log(
    'Package Name:',
    info.packageName
  );
  console.log(
    'Used:',
    bytes(info.usedQuota),
    'Remaining:',
    bytes(info.balanceQuota)
  );
});
