// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

'use strict';

var Client = require('azure-iothub').Client;

var connectionString = process.env.IOTHUB_CONNECTION_STRING;
if (!connectionString) {
  console.log('Please set the IOTHUB_CONNECTION_STRING environment variable.');
  process.exit(-1);
}

var client = Client.fromConnectionString(connectionString);

client.open(function (err) {
  if (err) {
    console.error('Could not connect: ' + err.message);
    process.exit(-1);
  } else {
    console.log('Client connected');

    client.getFileNotificationReceiver(function(err, receiver) {
      if(err) {
        console.error('Could not get file notification receiver: ' + err.message);
        process.exit(-1);
      } else {
        receiver.on('message', function(msg) {
          console.log('File uploaded: ');
          console.log(msg.data.toString());
          receiver.complete(msg, function(err) {
            if (err) {
              console.error('Could not complete the message: ' + err.message);
              process.exit(-1);
            } else {
              console.log('Message completed');
              process.exit(0);
            }
          });
        });
      }
    });
  }
});