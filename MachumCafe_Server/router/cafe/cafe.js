var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var mongoXlsx = require('mongo-xlsx')
var Cafe = require('../../model/cafe')
// var request = require('request')

// var url = 'http://api.visitkorea.or.kr/openapi/service/rest/KorService/areaBasedList?ServiceKey=2oPiB3ZpKeJ%2BodYLYiVHNKr2I4xa7Gf2vIJMa3nhky%2BTA734NySEvUeMjP8GX3z2eMlu8%2FmZfdlkcM6OiHasJg%3D%3D&contentTypeId=39&areaCode=&sigunguCode=&cat1=A05&cat2=A0502&cat3=A05020900&listYN=Y&MobileOS=IOS&MobileApp=MachumCafe&arrange=A&numOfRows=2&pageNo=1&MobileOS=IOS&MobileApp=MachumCafe&_type=json'
var db = mongoose.connection

var model = null
var xlsx = './model/initDB/cafeList.xlsx'

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

// router.get('/temp', function(req, res) {
//   var temp = []
//   request({
//     url: url, method: 'GET'
//   }, function(err, res, items) {
//     // console.log('Status', res.statusCode)
//     // console.log('Headers', JSON.stringify(res.headers))
//     // console.log('Response received', body)
//     // console.log(items)
//     var jsonItems = JSON.parse(items)
//     console.log(jsonItems.response.body.items.item)
//     jsonItems.response.body.items.item.forEach(function(obj) {
//       var url = 'http://api.visitkorea.or.kr/openapi/service/rest/KorService/detailCommon?ServiceKey=2oPiB3ZpKeJ%2BodYLYiVHNKr2I4xa7Gf2vIJMa3nhky%2BTA734NySEvUeMjP8GX3z2eMlu8%2FmZfdlkcM6OiHasJg%3D%3D&contentTypeId=39&contentId='
//       url += obj.contentid.toString() + '&MobileOS=IOS&MobileApp=MachumCafe&defaultYN=Y&firstImageYN=Y&areacodeYN=Y&catcodeYN=Y&addrinfoYN=Y&mapinfoYN=Y&overviewYN=Y&transGuideYN=Y&_type=json'
//       request({
//         url: url, method: 'GET'
//       }, function(err, res, items) {
//         var json = JSON.parse(items)
//         // console.log(json.response.body.items.item)
//       })
//       var url = 'http://api.visitkorea.or.kr/openapi/service/rest/KorService/detailIntro?ServiceKey=2oPiB3ZpKeJ%2BodYLYiVHNKr2I4xa7Gf2vIJMa3nhky%2BTA734NySEvUeMjP8GX3z2eMlu8%2FmZfdlkcM6OiHasJg%3D%3D&contentTypeId=39&contentId='
//       url += obj.contentid.toString() + '&MobileOS=IOS&MobileApp=MachumCafe&introYN=Y&_type=json'
//       request({
//         url: url, method: 'GET'
//       }, function(err, res, items) {
//         var json = JSON.parse(items)
//         // console.log(json.response.body.items.item)
//       })
//       var url = 'http://api.visitkorea.or.kr/openapi/service/rest/KorService/detailInfo?ServiceKey=2oPiB3ZpKeJ%2BodYLYiVHNKr2I4xa7Gf2vIJMa3nhky%2BTA734NySEvUeMjP8GX3z2eMlu8%2FmZfdlkcM6OiHasJg%3D%3D&contentTypeId=39&contentId='
//       url += obj.contentid.toString() + '&MobileOS=IOS&MobileApp=MachumCafe&listYN=Y&_type=json'
//       request({
//         url: url, method: 'GET'
//       }, function(err, res, items) {
//         var json = JSON.parse(items)
//         // console.log(json.response.body.items.item)
//       })
//     })
//
//   })
//   res.json(temp)
// })

module.exports = router
