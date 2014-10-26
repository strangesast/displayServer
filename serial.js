var SerialPort = require("serialport");

function testSerial(callback) {
  SerialPort.list(function(err, ports) {
  	callback(ports);
	});
}


module.exports = {
	'test': testSerial // return available ports
};
