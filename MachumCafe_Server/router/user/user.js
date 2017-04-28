var express = require('express')
var router = express.Router()
var passport = require('../../config/passport')
var User = require('../../model/user')

// register
router.post('/register', function(req, res, next) {
  passport.authenticate('register', function(err, user, info) {
    if(err) return next(err)
    if(user) return res.json({ message : 1 })
    else return res.json({ message : 0 })
  })(req, res, next)
})

// login
router.post('/login', function(req, res, next) {
 passport.authenticate('login', function(err, user, info) {
   if(err) res.json(err)
   if(!user) return res.json({ message : 0 })

   req.logIn(user, function(err) {
     if(err) return next(err)
     return res.json({ message : 1, user : user })
   })
 })(req, res, next)
})

// res 회원정보
router.get('/:id', function(req, res) {
  var id = req.params.id
  if(!req.user) {
    res.json({ 'message' : 'no session' })
  } else {
    if(req.user.id === id) {
      User.findById(id, function(err, user) {
        if(err) res.json(err)
        res.json(user)
      })
    } else {
      res.json({ 'message' : 'user session not match' })
    }
  }
})

module.exports = router
