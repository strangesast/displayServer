var express = require('express');
var router = express.Router();
var SerialPort = require("serialport");


/* GET home page. */
router.post('/', function(req, res) {
	var data = req.body;
	var method = data.method;
	if(data.method == 'test') {
		SerialPort.list(function(err, ports) {
			cb(ports);
		});
	}

	function cb(obj) {
		res.send(obj);
	}
	
});

module.exports = router;
