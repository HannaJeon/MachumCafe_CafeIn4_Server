var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var Cafe = require('../../model/cafe')
var Review = require('../../model/review')

// 현위치 1km 내 카페 전체목록
router.post('/', function(req, res) {
  Cafe.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [req.body.longitude, req.body.latitude]
        },
        $maxDistance: 1000
      }
    }
  }).exec(function(err, cafe) {
    res.json(cafe)
  })
})

// 특정 카페 정보 불러오기
router.get('/:id', function(req, res) {
  var id = req.params.id

  Cafe.findById(id, function(err, cafe) {
    res.json(cafe)
  })
})

// 카페 리뷰 등록
router.put('/:id/review', function(req, res) {
  var id = req.params.id

  Cafe.findById(id, function(err, cafe) {
    cafe.totalRating += req.body.review.rating
    cafe.rating = cafe.totalRating / (cafe.review.length+1)
    req.body.review.date = new Date().toISOString().slice(0,10)
    cafe.review.push(req.body.review)
    cafe.save(function(err) {
      if(err) res.json(err)
      res.json({ result: 1, description: '리뷰 등록!', reviews: cafe.review, rating: cafe.rating })
    })
  })
})

// 카페 리뷰 목록 불러오기
router.get('/:id/review/:page', function(req, res) {
  var id = req.params.id

  Cafe.findById(id, function(err, cafe) {
    var startIndex = cafe.review.length-1 - req.params.page
    var endIndex = 0
    if(startIndex === cafe.review.length-1) {
      endIndex = cafe.review.length - 3
    } else if(startIndex <= 10) {
      endIndex = 0
    } else {
      endIndex = startIndex-10
    }
    var reviews = []
    for(var i = startIndex; i >= endIndex; i--) {
      reviews.push(cafe.review[i])
    }

    if(endIndex <= 0) {
      console.log(123123);
      res.json({ result: 2, description: '성공!', reviews: reviews })
    } else {
      res.json({ result: 1, description: '성공!', reviews: reviews })
    }
  })
})

module.exports = router
