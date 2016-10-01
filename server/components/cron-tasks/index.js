'use strict';

const ns = require('node-schedule');
const worker = require('../../worker');

module.exports.run = () => {
  ns.scheduleJob('*/2 * * * *', () => {
    console.log(`Running worker: ${new Date()}`);
    worker();
  });
  worker();
};
