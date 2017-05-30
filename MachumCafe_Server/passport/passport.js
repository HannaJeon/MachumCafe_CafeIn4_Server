var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var User = require('../model/user')

passport.serializeUser(function(user, done) {
  done(null, user.id)
})

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user)
  })
})

passport.use('register', new LocalStrategy( {
  usernameField: 'email',
  passwordField: 'password',
  nicknameField: 'nickname',
  passReqToCallback: true
}, function(req, email, password, done) {
  User.findOne({ 'email': email }, function(err, user) {
    if(err) return done(err)
    if(user) {
      return done(null, false)
    } else {
      var user = new User()
      user.isKakaoImage = false
      user.email = email
      user.password = user.generateHash(password)
      user.nickname = req.body.nickname
      user.save(function(err) {
        if(err) throw err
        return done(null, user)
      })
    }
  })
}))

passport.use('login', new LocalStrategy( {
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function(req, email, password, done) {
  User.findOne({ 'email': email }, function(err, user) {
    if(err) return done(err)
    if(!user) return done(null, false)
    if(!user.validPassword(password)) return done(null, false)
    else {
      return done(null, user)
    }
  })
}))

module.exports = passport
