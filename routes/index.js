var express = require('express');
var router = express.Router();
var route = require('../routing');


/* GET home page. */
router.post('/', function(req, res) {
	var data = req.body;
	var method = data.method;
	console.log(data);
	if(!data.method) {
		res.send('invalid');
	} else {
		route(data, cb);
	}

	function cb(obj) {
		res.send(obj);
	}
	
});

module.exports = router;
