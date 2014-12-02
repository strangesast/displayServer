var SerialPort = require("serialport");
var port;
var inUse;

function testSerial(callback) {
	// return location of first Teensy device
	function cb(data) {
		if(data.length) {
		  for(var i=0; i<data.length; i++) {
				var _location = data[i].comName;
				var _name = data[i].pnpId;
				if(_name.substring(4, 10) == "Teensy") {
					callback(_location);
					break;
				}
			}	
		} else {
			callback('noDeviceConnected');
		}
	}
  SerialPort.list(function(err, ports) {
  	cb(ports);
	});
}

function setColor(callback, _loc, colorValue) {
	colorstring = "<x2|y2|w8|v8|sW10,FFFFFF|tW|b70|>"
	if(port === undefined) {
		port = new SerialPort.SerialPort(_loc, {baudrate:9600});
	}
	port.open(function (error) {
		if(!error) {
  	  port.on('open', function() {
  	  	console.log('open');
  	    port.write(colorstring, function(err, results) {
  	  		console.log('results');
  	  		callback('success');
  	  	});
  	  });
		} else {
			callback('failure');
		}
	});
}


module.exports = {
	'location': testSerial, // return available ports
	'test' : setColor
};
