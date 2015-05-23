var express = require('express');
var router = express.Router();
var Promise = require('es6-promise').Promise;
var nsd = require('displayControlAddon/build/Release/displayaddon.node');
var dlib = require('displayLibJS')



router.post('/', function(req, res) {
  res.send('hello')

});


module.exports = router;
