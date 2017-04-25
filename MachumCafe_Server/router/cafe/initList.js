var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var mongoXlsx = require('mongo-xlsx')

var db = mongoose.connection

var model = null
var xlsx = './model/initDB/cafeList.xlsx'

router.get('/', function(req, res) {
  console.log(req.user)
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
      db.collection('cafeList').insert(obj, function(err, result) {})
    })
  })
  res.send('init DB insert')
})

module.exports = router
