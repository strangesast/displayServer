var express = require('express');
var router = express.Router();
var serial = require('../serial');


/* GET home page. */
router.post('/', function(req, res) {
	var data = req.body;
	var method = data.method;
	if(!data.method) {
		res.send('invalid');
	} else {
		serial.test(cb);
	}

	function cb(obj) {
		res.send(obj);
	}
	
});

module.exports = router;
