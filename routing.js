var serial = require('./serial');


function route(data, callback) {
	var method = data.method;
  switch(method) {
		case 'test':
			console.log('made it here!!!')
			serial.test(callback);
			break;

		default:
			callback('invalidMethod');
	}
}

module.exports = route;
