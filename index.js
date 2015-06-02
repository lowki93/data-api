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
var socketArray = [];

wss.on('connection', function connection(ws) {
    console.log("connection");
    ws.on('message', function (data) {
        console.log(socketArray);
        var currentFile = JSON.parse(data);
        if (currentFile.type === 'desktop') {
            var userArray = {
                token : currentFile.token,
                connected : {
                    'mobile': false,
                    'desktop': true
                },
                socket: ws
            };
            console.log(userArray);
            socketArray.push(userArray);
        }
        if (currentFile.type === 'mobile') {

            var current = null;
            for (var i = 0; i < socketArray.length; i++) {
                console.log(socketArray[i], currentFile.token);
                if( socketArray[i].token == currentFile.token) {
                    current = socketArray[i];
                }
            }
            console.log(current);
             if (current != null) {
                 console.log(current.socket);
                 current.socket.send("toto");
             }

            console.log(userArray);
            //socketArray.push(userArray);
        }
        console.log(currentFile.type);
    });

    //ws.send({type: "toto", test: 'toto'});
});

app.listen(port);

console.log('[x] Listening on port ' + port);