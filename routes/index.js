var express = require('express');
var router = express.Router();
var route = require('../routing');


var SerialPort = require("serialport");

var Ports;

function getLocations(callback, refresh) {
	// run callback with Ports, refresh if refresh==true
	if(Ports === undefined || refresh !== undefined) {
    SerialPort.list(function(err, rawPorts) {
			var ports = [];
			for(var i=0; i<rawPorts.length; i++) {
				var _loc = rawPorts[i].comName;
				var _obj = {}; _obj[_loc] = new SerialPort.SerialPort(_loc);
				ports.push(_obj);
			}
			Ports = ports;
			callback(ports);
			console.log('fresh ports: ' + ports.length);
		});

	} else {
		callback(Ports);
	}
}

function writeString(callback, port, string) {
	port.open(function(err) {
		port.on('open', function() {
			port.write(string, function(err, results) {
				callback(err || results);
			});
		});
	});
}


function buildString(obj) {
	var str;
	if(obj.type == "text") {

	} else {
  	str = '<' + ['x' + obj.x, 'y' + obj.y,
			           'w' + (obj.x + obj.w),
				         'v' + (obj.y + obj.h)].join('|') +'sw10,FF0000|tW|b70|'+ '>'
	}

	return str
}


function update(callback, obj) {
	var _x = obj.x;
	var _y = obj.y;
	var _w = obj.w + _x;
	var _h = obj.h + _y;
	var str = "<x" + _x + "|y" + _y + "|w" + _w + "|v" + _h + "|" + "|sW10,FF0000|tW|b70|>";
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

var routing = {'update': update};

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
	var exampleObject = {'x': 1, 'y': 1, 'w': 10, 'h': 10};
	var string = buildString(exampleObject);
	console.log(string);
	writeString(function(_obj) {console.log(_obj);}, new SerialPort.SerialPort('/dev/pts/14'), string);
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
//
//
//
//function writeString(callback, serialPortObject, string, clear) {
//	var clearStr = "<x0|y0|w120|h8|sW100,000000|tW|b70|>";
//	busy = true
//	function clearIt(bool, callback) {
//		if(bool) {
//		  serialPortObject.write(clearStr, 
//														 function(err, results) {callback();});
//	  } else {
//			console.log('toast');
//			callback();
//		}
//	}
//
//	serialPortObject.open(function(err) {
//		if(!err) {
//			serialPortObject.on('open', function() {
//				clearIt(true, function() {
//				  serialPortObject.write(string, function(err, results) {
//				  	if(!err) {
//				  		callback('write success');
//				  	} else {
//				  		callback('error writing to serial');
//				  	}
//				  });
//				});
//
//			});
//
//		} else {
//			callback('error opening port');
//		}
//	});
//  busy = false;
//}
