/* 
 * Bootstrap file
 * Configuration
 */
module.exports = function () {
    return function (req, res, next) {

        //console.log(req);
        //console.log('       ' + req.url);
        next();

    };
};