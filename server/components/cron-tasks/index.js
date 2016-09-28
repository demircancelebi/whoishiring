'use strict';

const ns = require('node-schedule');
const worker = require('../../worker');
const cronIntervals = {
  '30m': '*/30 * * * *', // runs at 1:00, 1:30, 2:00, 2:30, 3:00...
  '1h': '1 * * * *', // runs at 1:01, 2:01, 3:01...
  '10m': '*/10 * * * *', // runs every ten minutes
  '1m': '* * * * *' // runs every minute
};

module.exports.run = () => {
  // ns.scheduleJob(cronIntervals['10m'], () => {
  //   console.log('---cron---');
  //   console.log(new Date());
  //   worker();
  // });
  worker();
};
