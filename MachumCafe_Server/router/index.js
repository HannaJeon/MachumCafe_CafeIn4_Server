var express = require('express')
var app = express()
var router = express.Router()
var initList = require('./cafe/initList')
var user = require('./user/user')

router.use('/cafe/initlist', initList)
router.use('/user', user)

module.exports = router
