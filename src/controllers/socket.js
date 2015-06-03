var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({ port: 9090 });
var socketArray = [];

module.exports = {

    createSocket: function () {

        wss.on('connection', function connection(ws) {
            console.log("connection");
            ws.on('message', function (data) {
                console.log(socketArray);
                var currentFile = JSON.parse(data);
                if (currentFile.type === 'desktop') {
                    var userArray = {
                        token: currentFile.token,
                        connected: {
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
                    var i;

                    for (i = 0; i < socketArray.length; i++) {
                        console.log(socketArray[i], currentFile.token);
                        if (socketArray[i].token == currentFile.token) {
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

    }
};