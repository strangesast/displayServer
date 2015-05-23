var express = require('express');
var router = express.Router();
var Promise = require('es6-promise').Promise;
var nsd = require('node-scoreboardDisplay/displayaddon/build/Release/displayaddon');

router.post('/', function(req, res) {
  
  res.send('hello')

});


module.exports = router;
