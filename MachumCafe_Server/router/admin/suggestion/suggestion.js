var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var multer = require('multer')
var path = require('path')
var uuid = require('uuid')
var SuggestionNewCafe = require('../../../model/suggestionNewCafe')

var storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, __dirname + '/images')
  },
  filename: function(req, file, callback) {
    callback(null, uuid.v4() + path.extname(file.originalname))
  }
})
var upload = multer({ storage: storage })

// 이미지 업로드
router.post('/uploads', upload.array('image'), function(req, res, next) {
  var filenames = []
  req.files.forEach(function(file) {
    filenames.push(file.filename)
  })
  res.json(filenames)
})

// 새로운 카페 제보
router.post('/newcafe', function(req, res) {
  var cafe = new SuggestionNewCafe()
  cafe.name = req.body.name
  cafe.address = req.body.address
  cafe.tel = req.body.tel
  cafe.hours = req.body.hours
  cafe.category = req.body.category
  cafe.imagesURL = req.body.imagesURL
  // 클라이언트 구현 되면 활성화
  // cafe.location = [req.body.longitude, req.body.latitude]
  cafe.save(function(err) {
    if(err) throw err
    else res.json({ result: 1 })
  })
})

router.post('/editCafe', function(req, res) {
  var suggestionCafe = new SuggestionNewCafe()
})

module.exports = router
