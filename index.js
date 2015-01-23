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

app.listen(port);

console.log('[x] Listening on port ' + port);