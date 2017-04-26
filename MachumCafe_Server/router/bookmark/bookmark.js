var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var Cafe = require('../../model/cafe')
var User = require('../../model/user')

var db = mongoose.connection

// get bookmark cafe
router.get('/:id', function(req, res) {
  var id = req.params.id

  if(!req.user) {
    res.json({ 'message' : 'no session' })
  } else {
    if(req.user.id === id) {
      User.findById(id, function(err, user) {
        if(err) res.json(err)

        var arr = user.bookmark.map(function(id) {
          return mongoose.Types.ObjectId(id)
        })
        Cafe.find({ '_id' : { $in : arr }}, function(err, cafe) {
          res.json(cafe)
        })
      })
    } else {
      res.json({ 'message' : 'Fail'})
    }
  }
})

// add or delete bookmark
router.put('/:id', function(req, res) {
  var id = req.params.id
  if(!req.user) {
    res.json({ 'message' : 'no session' })
  } else {
    if(req.user.id === id) {
      User.findById(id, function(err, user) {
        if(err) res.json(err)

        var cafe = user.bookmark.filter(function(cafe) {
           return cafe === req.body.cafeId
        })
        // cafeId가 북마크에 없을 경우 update
        if(cafe.length === 0) {
          user.bookmark.push(req.body.cafeId)
          user.save(function(err) {
            if(err) res.json(err)
          })
        } else {
          // cafeId가 북마크에 있을 경우 delete
          var index = user.bookmark.indexOf(req.body.cafeId)
          user.bookmark.splice(index, 1)
          user.save(function(err) {
            if(err) res.json(err)
          })
        }
        res.json({ 'bookmark' : user.bookmark })
      })
    } else {
      res.json({ 'message' : 'Fail' })
    }
  }
})

module.exports = router
