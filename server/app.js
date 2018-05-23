/**
 * Main application file
 */

'use strict';

import express from 'express';
import mongoose from 'mongoose';
mongoose.Promise = require('bluebird');
import config from './config/environment';
import http from 'http';

// Connect to MongoDB
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function(err) {
  console.error('MongoDB connection error: ' + err);
  process.exit(-1);
});

// Populate databases with sample data
if (config.seedDB) { require('./config/seed'); }

// Start cron tasks
import * as cr from './components/cron-tasks';
cr.run();

// Setup server
var app = express();
// var server = http.createServer(app);
// var socketio = require('socket.io')(server, {
//   serveClient: config.env !== 'production',
//   path: '/socket.io-client'
// });
// require('./config/socketio').default(socketio);
require('./config/express').default(app);
require('./routes').default(app);

var port = process.env.PORT || 5000;
app.listen(port);

console.log(`server started: ${port}`);

// Expose app
exports = module.exports = app;
