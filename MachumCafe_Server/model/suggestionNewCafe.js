var mongoose = require('mongoose')
var Schema = mongoose.Schema

var suggestionNewCafeSchema = new Schema({
  name: String,
  address: String,
  tel: String,
  hours: String,
  category: Array,
  imagesURL: Array,
  location: {
    index: '2dsphere',
    type: [Number]
  }
})

module.exports = mongoose.model('suggestion_newCafelist', suggestionNewCafeSchema)
