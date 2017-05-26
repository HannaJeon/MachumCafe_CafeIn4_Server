var mongoose = require('mongoose')
var Schema = mongoose.Schema

var reviewSchema = new Schema({
  userId: String,
  date: String,
  nickname: String,
  reviewContent: String,
  rating: Number
})

module.exports = mongoose.model('review', reviewSchema)
