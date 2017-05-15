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

module.exports = router
