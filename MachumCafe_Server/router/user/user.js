var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var multer = require('multer')
var path = require('path')
var passport = require('../../config/passport')
var User = require('../../model/user')
var Cafe = require('../../model/cafe')

router.use('/:id/profileimage', express.static(__dirname+'/profileImages'))

var storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, __dirname + '/profileImages')
  },
  filename: function(req, file, callback) {
    var userID = req.params.id
    callback(null, userID + path.extname(file.originalname))
  }
})
var upload = multer({ storage: storage })

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

// kakao 로그인 시 유저 정보 저장
router.post('/login/kakao', function(req, res) {
  User.findOne({ email: req.body.email }, function(err, user) {
    if(err) throw err
    if(user) {
      if(user.nickname !== req.body.nickname && req.body.nickname !== "") {
        user.nickname = req.body.nickname
      } else if(user.imageURL !== req.body.imageURL && req.body.imageURL !== "") {
        user.imageURL = req.body.imageURL
      }
      user.save(function(err) {
        if(err) throw err
      })
      console.log(user)
      res.json({ result: 1, user: user })
    } else {
      var user = new User()
      user.email = req.body.email
      user.nickname = req.body.nickname
      user.imageURL = req.body.imageURL
      user.save(function(err) {
        if(err) throw err
        res.json({ result: 1, user: user, description: '카카오톡 유저 저장 성공!' })
      })
    }
  })
})

// user profile image 변경
router.put('/:id/profileimage', upload.single('image'), function(req, res, next) {
  var userID = req.params.id
  if(req.file !== undefined) {
    User.findById(userID, function(err, user) {
      if(user) {
        user.imageURL = req.file.filename
        user.save(function(err) {
          if(err) throw err
          res.json({ result: 1, imageURL: user.imageURL })
        })
      } else {
        res.json({ result: 0 })
      }
    })
  } else {
    res.json({ result: 0 })
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

  // if(!req.user) {
  //   res.json({ result: 0, description: '세션정보 없음!' })
  // } else {
    // if(req.user.id === id) {
      User.findById(id, function(err, user) {
        if(err) res.json(err)

        var arr = user.bookmark.map(function(id) {
          return mongoose.Types.ObjectId(id)
        })
        Cafe.find({ '_id': { $in: arr }}, function(err, cafe) {
          res.json({ result: 1, cafe: cafe, description: '카페목록 불러오기 성공!' })
        })
      })
    // } else {
    //   res.json({ result: 'Fail'})
  //   }
  // }
})

// add or delete My bookmark
router.put('/:id/bookmark', function(req, res) {
  var id = req.params.id
  // if(!req.user) {
  //   res.json({ result: 0, description: '세션정보 없음!' })
  // } else {
    // if(req.user.id === id) {
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
    // } else {
    //   res.json({ result: 'Fail' })
    // }
  // }
})

module.exports = router
