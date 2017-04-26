var express = require('express')
var app = express()
var router = express.Router()
var cafe = require('./cafe/cafe')
var user = require('./user/user')
var bookmark = require('./bookmark/bookmark')

router.use('/cafe', cafe)
router.use('/user', user)
router.use('/bookmark', bookmark)

module.exports = router
