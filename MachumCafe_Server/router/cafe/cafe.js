var express = require('express')
var router = express.Router()
var path = require('path')
var mongoose = require('mongoose')
var mongoXlsx = require('mongo-xlsx')
var Cafe = require('../../model/cafe')

var model = null
var xlsx = './model/initDB/cafeList.xlsx'

router.use(express.static(path.join(__dirname, '../../images')))

// 데이터 저장
router.get('/initList', function(req, res) {
  // db insert from xlsx
  mongoXlsx.xlsx2MongoData(xlsx, model, function(err, data) {
    if(err) throw err
    // 카페 DB 가공(?)
    data.forEach(function(obj) {
      obj.category = []
      if(obj.mainMenu) {
        obj.mainMenu = obj.mainMenu.split(',')
      }
      if(obj.smokingArea) {
        if (obj.smokingArea.indexOf('흡연') !== -1) obj.category.push('흡연')
      }
      if(obj.parking) {
        if(obj.parking.indexOf('가능') !== -1) obj.category.push('주차')
      }
      if(obj.tableInfo) {
        if(obj.tableInfo.indexOf('룸') !== -1) obj.category.push('룸')
      }
      if(obj.wc) {
        obj.category.push('화장실')
      }
      if(obj.terrace) {
        obj.category.push('테라스')
      }
      obj.imagesName = ['profile.jpeg', 'cafeImage.jpg']
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
router.get('/', function(req, res) {
  Cafe.find(function(err, cafe) {
    if(err) res.json(err)
    res.json(cafe)
  })
})

module.exports = router
