var mongoose = require('mongoose')
var review = require('./review').schema
var Schema = mongoose.Schema

var suggestionClosedCafeSchema = new Schema({
  cafeID: String,
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

module.exports = mongoose.model('suggestion_closedCafelist', suggestionClosedCafeSchema)
