express = require 'express'
router = express.Router()
#Promise = require('es6-Promise').Promise
#display_lib = require 'displayLibJS'


router.route('/').get (req, res, next) ->
    res.send {}

router.route('/test').all (req, res, next) ->
    res.send {'toast' : 'toast'}


module.exports = router
