var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({ port: 9090 });
var socketArray = [];

module.exports = {

    createSocket: function () {

        wss.on('connection', function connection(ws) {

            ws.on('message', function (data) {
                var current = null;
                var currentFile = JSON.parse(data);
                console.log(currentFile.type, currentFile.activation);
                if (currentFile.type === 'desktop') {
                    console.log("desktop connect : " + currentFile.token);
                    var userArray = {
                        token: currentFile.token,
                        connected: {
                            'mobile': false,
                            'desktop': true
                        },
                        socket: ws
                    };

                    socketArray.push(userArray);
                }
                if (currentFile.type === 'mobile') {

                    console.log("mobile connect : " + currentFile.token);
                    current = module.exports.getCurrentUser(currentFile.token);

                    if (current !== null) {
                        module.exports.sendPairingDone(current.socket);
                        module.exports.sendPairingDone(ws);
                    }
                    //module.exports.sendPairingDone(ws);
                }
                if (currentFile.activation === 'heart') {

                    current = module.exports.getCurrentUser(currentFile.token);

                    if (current !== null) {
                        module.exports.sendDataForPairing(current.socket, currentFile.data, currentFile.activation);
                    }
                }
                if (currentFile.activation === 'geolocation') {

                    current = module.exports.getCurrentUser(currentFile.token);

                    if (current !== null) {
                        module.exports.sendDataForPairing(current.socket, currentFile.data, currentFile.activation);
                    }
                }
                if (currentFile.activation === 'pedometer') {

                    current = module.exports.getCurrentUser(currentFile.token);

                    if (current !== null) {
                        module.exports.sendDataForPairing(current.socket, currentFile.data, currentFile.activation);
                    }
                }
                if (currentFile.activation === 'photos') {

                    current = module.exports.getCurrentUser(currentFile.token);

                    if (current !== null) {
                        module.exports.sendDataForPairing(current.socket, currentFile.data, currentFile.activation);
                    }
                }
                if (currentFile.activation === 'next') {

                    current = module.exports.getCurrentUser(currentFile.token);

                    if (current !== null) {
                        module.exports.sendDataForPairing(current.socket, currentFile.data, currentFile.activation);
                    }
                }
                if (currentFile.activation === 'end') {

                    current = module.exports.getCurrentUser(currentFile.token);

                    if (current !== null) {
                        module.exports.sendDataForPairing(current.socket, currentFile.data, currentFile.activation);
                    }
                }
            });

        });
    },
    sendPairingDone: function (webSocket) {

        var string = JSON.stringify({pairing: true});
        webSocket.send(string);
    },
    sendDataForPairing: function (webSocket, data, type) {
        console.log('send for ' + type);
        var string = JSON.stringify({activation: type, data: data});
        webSocket.send(string);
    },
    getCurrentUser: function (token) {
        var current = null,
            i;
        for (i = 0; i < socketArray.length; i++) {
            if (socketArray[i].token === token) {
                current = socketArray[i];
            }
        }
        return current;
    }
};