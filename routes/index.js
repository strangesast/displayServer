var express = require('express');
var router = express.Router();
var Promise = require('es6-promise').Promise;
var serialPort = require('serialport');
var config = require('../config');

var Ports;
var openPorts = {};

// return serialized version of display object
function serializeObject(_object) {
	// _object (Object)
	return '';
}

function returnPort(_comName) {
	// _comName (String)

}

function sendSerial(_port, _buffer) {
	// _port (Promise), _buffer (Buffer)
	return new Promise(function(resolve, reject) {
		_port.then(function(p) {
			// may need to add flush
			p.open(function(err) {
				// may need to wait for open event
				p.write(_buffer, function(err) {
					if(err) reject(err);
					else resolve();
				});
			});
		});
	});
}

function refreshAvailablePorts() {
	return new Promise(function(resolve, reject) {
	  serialPort.list(function(err, ports) {
			Ports = ports; // probably a bad idea
			resolve(ports);  // should add if err above, no reject
	  });
	});
}


router.get('/', function(req, res) {
	var name = config.name;
	var availPorts = refreshAvailablePorts(); // return promise with ports
	var obj = {};

	availPorts.then(function(ports) {
		obj.ports = ports;
		obj.title = name;
		// match portId with comName

		res.render('index', obj);
	},
	function(error) {
		console.log('error');
		res.status = 500;
		res.send(error);
	});
});


router.get('/:portId', function(req, res) {
	// (only) if Ports is empty, check again
	var p = Promise.resolve(Ports);
	if(Ports === undefined || Ports.length < 1) p = refreshAvailablePorts();
	var ids = req.params.portId.split('+');
	var requestedPorts = [];

	p.then(function(ports) {
		// match portId with comName
	  for(var i=0; i<ports.length; i++) {
	  	// if comname is currently present
	  	if(ids.indexOf(Ports[i].comName) > -1) {
	  		requestedPorts.push(Ports[i]);
	  	}
	  }

		return requestedPorts;

	}).then(function(request) {
		res.send(request);

	}, function() {
		res.status = 500; res.send();

	});
});


module.exports = router;
