var express = require('express')
var app = express()
var router = express.Router()
var admin = require('./admin/admin') // 제공하지 X ex)제보받은 카페 & 크롤링 후 DB화
var cafe = require('./cafe/cafe') // 제공하는 api
var user = require('./user/user')

router.use('/admin', admin)
router.use('/cafe', cafe)
router.use('/user', user)

module.exports = router
