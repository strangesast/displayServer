var express = require('express');
var router = express.Router();
var route = require('../routing');


var SerialPort = require("serialport");

function getLocations(callback) {
	// return array of serial device locations
  SerialPort.list(function(err, ports) {
		var deviceList = [];
		for(var i=0; i<ports.length; i++){
			var _port = ports[i];
			var _location = _port.comName;
			var _name = _port.pnpId;
			deviceList.push({'name' : _name, 'location': _location});
		}
		callback(deviceList);
	});
}

var busy;

function writeString(callback, serialPortObject, string, clear) {
	var clearStr = "<x0|y0|w120|h8|sW100,000000|tW|b70|>";
	busy = true
	function clearIt(bool, callback) {
		if(bool) {
		  serialPortObject.write(clearStr, 
														 function(err, results) {callback();});
	  } else {
			console.log('toast');
			callback();
		}
	}

	serialPortObject.open(function(err) {
		if(!err) {
			serialPortObject.on('open', function() {
				clearIt(true, function() {
				  serialPortObject.write(string, function(err, results) {
				  	if(!err) {
				  		callback('write success');
				  	} else {
				  		callback('error writing to serial');
				  	}
				  });
				});

			});

		} else {
			callback('error opening port');
		}
	});
  busy = false;
}


function test(callback, color) {
	getLocations(function(ports) {
		for(var i=0; i<ports.length; i++) {
			console.log(ports[i].name + " at " + ports[i].location);
			
  		port = new SerialPort.SerialPort(ports[i].location, {baudrate:9600});
			var str = "<x0|y0|w100|v8|sW10," + color.substring(0, 6) + "|tW|b70|>"
			if(!busy){
				writeString(callback, port, str, true);
			} else {
				callback('busy');
			}
		}
	});
}

function update(callback, obj) {
	var _x = obj.x;
	var _y = obj.y;
	var _w = obj.w + _x;
	var _h = obj.h + _y;
	var str = "<x" + _x + "|y" + _y + "|w" + _w + "|v" + _h + "|" + "sW10,FF0000|tW|b70|>";
	console.log(str);
	getLocations(function(ports) {
	  for(var i=0; i<ports.length; i++){
	  	writeString(
	  		function(_obj) {console.log(_obj)},
	  	 	new SerialPort.SerialPort(ports[i].location, {baudrate:9600}),
	  		str
	  	);
	  }
	  callback('gotit')
	});
}

var routing = {'test': test, 'update': update};

router.post('/', function(req, res) {
	var data = req.body;
	var method = routing[data.method];
	if(data.method === undefined) {
		res.send('invalid');
	} else {
		method(function(_obj) {res.send(_obj);}, data.what);
	}
	
});

router.get('/', function(req, res) {
	res.render('index');
});

module.exports = router;

//var port;
//var inUse;
//
//function setColor(callback, _loc, colorValue) {
//	colorstring = "<x2|y2|w8|v8|sW10,FFFFFF|tW|b70|>"
//	if(port === undefined) {
//		port = new SerialPort.SerialPort(_loc, {baudrate:9600});
//	}
//	port.open(function (error) {
//		if(!error) {
//  	  port.on('open', function() {
//  	  	console.log('open');
//  	    port.write(colorstring, function(err, results) {
//  	  		console.log('results');
//  	  		callback('success');
//  	  	});
//  	  });
//		} else {
//			callback('failure');
//		}
//	});
//}
//module.exports = {
//	'location': testSerial, // return available ports
//	'test' : setColor
//};
