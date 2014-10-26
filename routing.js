var serial = require('./serial');


function route(data, callback) {
	var method = data.method;
  switch(method) {
		case 'test':
			serial.location(function(_loc) {
			  serial.test(callback, _loc, 0);
		  });

			break;

		default:
			callback('invalidMethod');
	}
}

module.exports = route;
