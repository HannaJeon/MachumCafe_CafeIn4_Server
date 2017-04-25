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
     return res.json(user)
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

// add bookmark(modify)
// 북마크에 카페 아이디가 있으면 delete, 없으면 update
// response로 바뀐 북마크 주기

// router.put('/:id/bookmark', function(req, res) {
//   var id = req.params.id
//   if(!req.user) {
//     res.json({ 'message' : 'no session' })
//   } else {
//     if(req.user.id === id) {
//       User.findByIdAndUpdate(id, {bookmark : req.body.bookmark}, function(err, user) {
//         if(err) res.json(err)
//         res.json(user.bookmark)
//       })
//     } else {
//       res.json({ 'mesaage' : 'Fail' })
//     }
//   }
// })

router.put('/:id/bookmark', function(req, res) {
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
          user.bookmark.splice(index)
          user.save(function(err) {
            if(err) res.json(err)
          })
        }
        res.json({ 'bookmark' : user.bookmark })
      })
    } else {
      res.json({ 'mesaage' : 'Fail' })
    }
  }
})

// get bookmark
// router.get(':id/bookmark', function(req, res) {
//   var id = req.params.id
//   if(!req.user) {
//     res.json({ 'message' : 'no session' })
//   } else {
//     if(req.user.id === id) {
//       User.findById(id, function(err, user) {
//         if(err) res.json(err)
//         res.json(user.bookmark)
//       })
//     } else {
//       res.json({ 'message' : 'user session not match' })
//     }
//   }
// })

// modify member
// router.put('/:id', function(req, res) {
//   var id = req.params.id
//   if(!req.user) {
//     res.json({ 'message' : 'no session' })
//   } else {
//     if(req.user.id === id) {
//       var user = new User()
//       User.findByIdAndUpdate(id, {
//         email : req.body.email,
//         password : user.generateHash(req.body.password),
//         nickname : req.body.nickname,
//         bookmark : req.body.bookmark
//       }, function(err, user) {
//         if(err) res.json(err)
//         res.json({ 'message' : 'Success' })
//       })
//     } else {
//       res.json({ 'mesaage' : 'Fail' })
//     }
//   }
// })

// api/v1/user/id/bookmark
module.exports = router


// 세션정보 확인
// 세션 저장되는 정보 추가
// request.session 확인
// user get router만들기
// users/id
// GET users/id/bookmark
// modify 먼저 만들고
// GET 만들기
