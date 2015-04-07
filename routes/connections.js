var express = require('express');
var router = express.Router();
var config = require('../config');
var Promise = require('es6-promise').Promise;
var net = require('net');
var JsonSocket = require('json-socket');

var scoreboard = new JsonSocket(new net.Socket());

router.route('/')
.get(function(req, res, next) {
	res.render('connections', {'title' : 'Connections'});

})
.post(function(req, res, next) {
	var body = req.body;
	console.log(body);
	if('connection' in body) {
		var con = body.connection;
		var host = con.host;
	  var port = con.port;
		initiateConnection(host, port).then(function(connection) {
			connection.on('message', function(message) {
				console.log(message);
			});

		}, function(err) {
			return next(new Error(err));
		});
	}
})


var initiateConnection = function(host, port) {
	if(!net.isIP(host)) return Promise.reject('bad ip');
	return new Promise(function(resolve, reject) {
	  scoreboard.connect(port, host)
		resolve(scoreboard);
	})

}

module.exports = router;
