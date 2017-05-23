var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var Cafe = require('../../model/cafe')

// 데이터 Get
router.get('/', function(req, res) {
  Cafe.find(function(err, cafe) {
    if(err) res.json(err)
    res.json(cafe)
  })
})

router.post('/', function(req, res) {
  Cafe.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [req.body.longitude, req.body.latitude]
        },
        // $near: [req.body.longitude, req.body.latitude],
        $maxDistance: 1000
      }
      // $geoWithin: {
      //   $centerSphere: [[req.body.longitude, req.body.latitude], 1 / 6378.1]
      // }
    }
  }).exec(function(err, cafe) {
    console.log(cafe.length)
    res.json(cafe)
  })
})

router.get('/test', function(req, res) {
  Cafe.find({}, function(err, cafes) {
    cafes.forEach(function(cafe) {
      cafe.mainImage = cafe.imagesURL[0]
      cafe.save(function(err) {
        if(err) throw err
      })
    })
    console.log("cafe", cafes.length)
  })
  res.json(1)
})

router.put('/:id/review', function(req, res) {
  var id = req.params.id
  if(!req.user) {
    res.json({ message: 0, description: '세션정보 없음!' })
  } else {
    Cafe.findById(id, function(err, cafe) {
      cafe.review.push(req.body.review)
      cafe.save(function(err) {
        if(err) res.json(err)
        res.json({ message: 1, description: '리뷰 등록!', reviews: cafe.review })
      })
    })
  }
})

router.get('/:id/review', function(req, res) {
  var id = req.params.id
  Cafe.findById(id, function(err, cafe) {
    res.json({ message: 1, description: '성공!', reviews: cafe.review })
  })
})

module.exports = router
