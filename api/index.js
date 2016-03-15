var fs 		= require('fs'),
	express = require('express'),
	router 	= express.Router();

/*
 * general request handler to all routes on /api
 * 
 */
router.use(function(req, res, next) {
	res.set('Content-Type', 'application/json');
	res.status(200);
	next();
});

/*
 * /api
 * returns a nice empty hash with only success
 */
router.get('/', function(req, res) {
	res.send({success: true});
});

/*
 * /api/files
 * returns all files listed in assets/sounds
 */
router.get('/files', function(req, res) {

	var files = fs.readdir('./assets/sounds', function(err, data) {
		if(err) {
			throw(err);
			res.status(500);
			res.send({
				status: 'error'
			});
		} else {
			res.send(data);
		}
	});

});

module.exports = router;
