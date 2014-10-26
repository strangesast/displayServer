var SerialPort = require("serialport");

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


module.exports = {
	'test': testSerial // return available ports
};
