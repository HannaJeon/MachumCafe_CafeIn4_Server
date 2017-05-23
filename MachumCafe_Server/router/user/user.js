var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var passport = require('../../config/passport')
var User = require('../../model/user')
var Cafe = require('../../model/cafe')

// register
router.post('/register', function(req, res, next) {
  passport.authenticate('register', function(err, user, info) {
    if(err) return next(err)
    if(user) return res.json({ result: 1, description: '회원가입 성공!' })
    else return res.json({ result: 0, description: '회원가입 실패!ㅠㅠ'})
  })(req, res, next)
})

// login
router.post('/login', function(req, res, next) {
 passport.authenticate('login', function(err, user, info) {
   if(err) res.json(err)
   if(!user) return res.json({ result: 0, description: '로그인 실패!ㅠㅠ' })

   req.logIn(user, function(err) {
     if(err) return next(err)
     return res.json({ result: 1, user: user, description: '로그인 성공!' })
   })
 })(req, res, next)
})

// res 회원정보
router.get('/login', function(req, res) {
  if(req.user) {
    User.findById(req.user.id, function(err, user) {
      if(err) res.json(err)
      res.json({ result: 1, user: user, description: '유저정보 로드 성공!' })
    })
  } else {
    res.json({ result: 0, description: '세션정보 없음!' })
  }
})

// logout
router.get('/logout', function(req, res) {
  req.session.destroy()
  res.clearCookie('keyboard cat')
  res.json({ result: 1, description: '세션 정보 삭제!' })
})

// get My bookmark cafe
router.get('/:id/bookmark', function(req, res) {
  var id = req.params.id

  if(!req.user) {
    res.json({ result: 0, description: '세션정보 없음!' })
  } else {
    if(req.user.id === id) {
      User.findById(id, function(err, user) {
        if(err) res.json(err)

        var arr = user.bookmark.map(function(id) {
          return mongoose.Types.ObjectId(id)
        })
        Cafe.find({ '_id': { $in: arr }}, function(err, cafe) {
          res.json({ result: 1, cafe: cafe, description: '카페목록 불러오기 성공!' })
        })
      })
    } else {
      res.json({ result: 'Fail'})
    }
  }
})

// add or delete My bookmark
router.put('/:id/bookmark', function(req, res) {
  var id = req.params.id
  if(!req.user) {
    res.json({ result: 0, description: '세션정보 없음!' })
  } else {
    if(req.user.id === id) {
      User.findById(id, function(err, user) {
        if(err) res.json(err)

        var cafe = user.bookmark.filter(function(cafe) {
           return cafe === req.body.cafeId
        })
        // cafeId가 북마크에 없을 경우 add
        if(cafe.length === 0) {
          user.bookmark.push(req.body.cafeId)
          user.save(function(err) {
            if(err) res.json(err)
            res.json({ result: 1, description: '즐겨찾기 추가!', userBookmark: user.bookmark })
          })
        } else {
          // cafeId가 북마크에 있을 경우 delete
          var index = user.bookmark.indexOf(req.body.cafeId)
          user.bookmark.splice(index, 1)
          user.save(function(err) {
            if(err) res.json(err)
            res.json({ result: 1, description: '즐겨찾기 삭제!', userBookmark: user.bookmark })
          })
        }
      })
    } else {
      res.json({ result: 'Fail' })
    }
  }
})

module.exports = router
