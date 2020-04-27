# dialog-data-usage made use of an API issue with Dialog Axiata's systems that have been patched long time ago and as a result, this module won't work anymore

# dialog-data-usage
A module to measure and monitor your Dialog 4G/LTE data usage

## Installation
  npm install dialog-data-usage --save

## Notes
I don't know if this is legal or not (since I'm using some of their internal APIs), but I hope no harm will come out with me releasing this module. Please don't sue me Dialog (^^").

## Usage

```js
var dialog = require('dialog-data-usage').create({
  connectionNumber: 114123456,
  type: 'LTE', // LTE, prepaid
  interval: 5000, // milliseconds
  limit: 80 // %
});

dialog.getDataUsage(function(error, data){
  if(error) throw error;
  console.log(data);
});
```

## API
### getDataUsage(error, data)
Responds with the current data usage of your connections, along with the packages. You can use [pretty-bytes](https://www.npmjs.com/package/pretty-bytes) to convert the bytes into human-readable strings.

```js

dialog.getDataUsage(function(error, data){
  if(error) throw error;
  console.log(data);
});

[
  { quotaId: 'day-time-data',
    packageCode: 'LTE_Home',
    packageName: 'Any Time Data',
    totalQuota: 26843545600,
    usedQuota: 26843545600,
    balanceQuota: 0,
    expiryDate: Sun Mar 20 2016 00:00:00 GMT+0530 (IST) },
  { quotaId: 'night-time-data',
    packageCode: 'LTE_25GB_NT',
    packageName: 'Night Time Data (12 midnight - 8 a.m)',
    totalQuota: 26843545600,
    usedQuota: 26843545600,
    balanceQuota: 0,
    expiryDate: Sun Mar 20 2016 00:00:00 GMT+0530 (IST) },
  { quotaId: 'extension-data',
    packageCode: 'LTE_More3',
    packageName: 'Data Extension',
    totalQuota: 21474836480,
    usedQuota: 21474836480,
    balanceQuota: 0,
    expiryDate: Sun Mar 20 2016 00:00:00 GMT+0530 (IST) }
]
```

### getDataUsageHistory(error, data)
Responds with your your data sessions over a certain time period.

__Note: This doesn't seem to work anymore because they've patched their API, and
actually started verifying data it receives. It now needs your IMSI (globally-unique code number that identifies a GSM subscriber to the network).__

```js
dialog.getDataUsageHistory(function(error, data){
  if(error) throw error;
  console.log(data);
});

[
  { quotaID: 'night-time-data',
    packageName: 'Night Time',
    date: Wed Mar 02 2016 00:00:00 GMT+0530 (IST),
    usedQuota: 40726691,
    balanceQuota: 13765370183 },
  { quotaID: 'extension-data',
    packageName: 'Extension',
    date: Thu Mar 03 2016 00:00:00 GMT+0530 (IST),
    usedQuota: 489989079,
    balanceQuota: 5744518758 },
  { quotaID: 'extension-data',
    packageName: 'Extension',
    date: Fri Mar 04 2016 00:00:00 GMT+0530 (IST),
    usedQuota: 74385981,
    balanceQuota: 5669356830 },
  { quotaID: 'night-time-data',
    packageName: 'Night Time',
    date: Fri Mar 04 2016 00:00:00 GMT+0530 (IST),
    usedQuota: 268435456,
    balanceQuota: 13464722472 },
  { quotaID: 'extension-data',
    packageName: 'Extension',
    date: Sat Mar 05 2016 00:00:00 GMT+0530 (IST),
    usedQuota: 3070901616,
    balanceQuota: 2598455214 },
]
```

### listen() [ALPHA]
Polls the API and emits events. Currently emits 'update', 'limit', and 'finished'. Just note that this is a random feature I decided to add and is currently buggy (because there probably is a better way to do this).

```js
dialog.listen();

var iteration = 0;
dialog.once('update', function(info){
  // Clears the screen.
  process.stdout.write('\033c');
  console.log('Iteration:', iteration++);
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

listen.once('limit', function(info){
  console.log(info.packageName, 'package is almost over.');
});

listen.once('finished', function(info){
  console.log(info.packageName, 'package is over.');
});

```

## Tests
  No tests yet.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.

## Bugs
Plenty. If you find any, please do let me know. I also don't mind pull-requests, so if you want to contribute, please do. c:

## Release History
- 0.1.0 Initial release
