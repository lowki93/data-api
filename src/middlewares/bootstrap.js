/* 
 * Bootstrap file
 * Configuration
 */
module.exports = function () {
	return function (req, res, next) {

		console.log('[x] GET ' + req.url);
		next();
	};
};