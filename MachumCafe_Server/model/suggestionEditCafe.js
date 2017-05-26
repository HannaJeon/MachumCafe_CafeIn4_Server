var mongoose = require('mongoose')
var review = require('./review').schema
var Schema = mongoose.Schema

// 다이닝코드 크롤링 Schema
var suggestionEditCafeSchema = new Schema({
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
  review: [review]
})

module.exports = mongoose.model('suggestion_editCafelist', suggestionEditCafeSchema)
