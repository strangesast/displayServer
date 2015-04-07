var express = require('express');
var router = express.Router();
var config = require('../config');
var Promise = require('es6-promise').Promise;
var net = require('net');
var JsonSocket = require('json-socket');

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port: 8083 });


wss.on('connection', function(ws) {
  ws.on('message', function(message) {
    console.log('received: %s', message);
  });

  ws.send('welcome');
});

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};

router.route('/')
.get(function(req, res, next) {
	res.render('connections', {'title' : 'Connections'});

})
.post(function(req, res, next) {
	var body = req.body;
	if('connection' in body) {
		var con = body.connection;
		var host = con.host;
	  var port = con.port;
		initiateConnection(host, port).then(function(connection) {
      console.log('here');
			connection.on('error', function(err) {
        console.log('err');
        wss.broadcast(err);
			});

      connection.on('connect', function(message) {

        connection.on('message', function(message) {
          console.log('message');
          wss.broadcast(message);
        });

        
        wss.broadcast('connected');
      });

      connection.on('end', function() {
        wss.broadcast('end');
      })

      res.json();
		}, function(err) {
			res.status(400).json(err);
		});
	} else {
    res.json('toast');
  }
});


var initiateConnection = function(host, port) {
	return new Promise(function(resolve, reject) {
    console.log('attempting to connect on ' + host + ' ' + port);
    var socket = new JsonSocket(new net.Socket());
    socket.connect(port, host);
    resolve(socket);
	})

}

module.exports = router;
