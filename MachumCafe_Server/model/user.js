var mongoose = require('mongoose')
var bcrypt = require('bcrypt-nodejs')
var Schema = mongoose.Schema

var userSchema = new Schema({
  email: String,
  password: String,
  nickname: String,
  bookmark: Array,
  imageURL: String
})

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

userSchema.methods.validPassword = function(password) {
  if(this.password !== undefined) {
    return bcrypt.compareSync(password, this.password)
  }
}

module.exports = mongoose.model('user', userSchema)
