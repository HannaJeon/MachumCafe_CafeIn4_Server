var mongoose = require('mongoose')
var Schema = mongoose.Schema

var Review = new Schema({
  userId: String,
  date: String,
  nickname: String,
  reviewContent: String,
  rating: Number
})

mongoose.model('Review', Review)

// 다이닝코드 크롤링 Schema
var cafeSchema = new Schema({
  name: String,
  address: String,
  tel: String,
  keywords: Array,
  hours: String,
  menu: String,
  category: Array,
  imagesURL: Array,
  location: {
    index: '2dsphere',
    type: [Number]
  },
  review: [Review]
})

module.exports = mongoose.model('cafelist', cafeSchema)
