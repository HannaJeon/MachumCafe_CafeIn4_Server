var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var mongoXlsx = require('mongo-xlsx')
var Cafe = require('../../model/cafe')

var db = mongoose.connection

var model = null
var xlsx = './model/initDB/cafeList.xlsx'

// 데이터 저장
router.get('/initList', function(req, res) {
  // db insert from xlsx
  mongoXlsx.xlsx2MongoData(xlsx, model, function(err, data) {
    // if value === "nil" change ""
    data.forEach(function(obj) {
      for(var key in obj) {
        if(obj[key] === "nil") {
          obj[key] = ""
        }
      }
      // db insert
      var cafe = new Cafe(obj)
      cafe.save(function(err, result) {
        if(err) throw err
      })
    })
  })
  res.send('init DB insert')
})

// 데이터 Get
// router.get('/', function(req, res) {
//   Cafe.findAll()
// })


module.exports = router
