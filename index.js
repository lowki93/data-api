/*
 *
 * https://github.com/Syrups/nodejs-starter
 *
 * Copyright (c) 2014
 * Licensed under the MIT license.
 */

'use strict';

var app = require('./src/app').app;
var port = Number(process.env.PORT || 5000);
var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({ port: 9090 });

wss.on('connection', function connection(ws) {
    ws.on('message', function (data) {
        var currentFile = JSON.parse(data);
        console.log(currentFile);
    });

    ws.send({type: "toto", test: 'toto'});
});

app.listen(port);

console.log('[x] Listening on port ' + port);