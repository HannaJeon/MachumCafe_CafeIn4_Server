var express = require('express')
var router = express.Router()
var passport = require('../../config/passport')
var User = require('../../model/user')

// register
router.post('/register', function(req, res, next) {
  passport.authenticate('register', function(err, user, info) {
    if(err) return next(err)
    if(user) return res.json({ message : 1, description : '회원가입 성공!' })
    else return res.json({ message : 0, description : '회원가입 실패!ㅠㅠ'})
  })(req, res, next)
})

// login
router.post('/login', function(req, res, next) {
 passport.authenticate('login', function(err, user, info) {
   if(err) res.json(err)
   if(!user) return res.json({ message : 0, description : '로그인 실패!ㅠㅠ' })

   req.logIn(user, function(err) {
     if(err) return next(err)
     return res.json({ message : 1, user : user, description : '로그인 성공!' })
   })
 })(req, res, next)
})

// res 회원정보
router.get('/login', function(req, res) {
  if(!req.user) {
    res.json({ message : 0, description : '세션정보 없음!' })
  } else {
    if(req.user) {
      User.findById(req.user.id, function(err, user) {
        if(err) res.json(err)
        res.json({ message : 1, user : user, description : '유저정보 로드 성공!' })
      })
    } else {
      res.json({ description : '유저정보와 세션정보 불일치!' })
    }
  }
})

module.exports = router
