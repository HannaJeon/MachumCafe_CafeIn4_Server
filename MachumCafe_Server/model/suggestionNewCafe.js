var mongoose = require('mongoose')
var Schema = mongoose.Schema

var suggestionCafeSchema = new Schema({
  name: String,
  address: String,
  tel: String,
  hours: String,
  rate: String,
  category: Array,
  imagesURL: Array,
  location: {
    index: '2dsphere',
    type: [Number]
  }
})

module.exports = mongoose.model('suggestion_newCafelist', suggestionCafeSchema)
