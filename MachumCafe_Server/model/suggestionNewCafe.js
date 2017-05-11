var mongoose = require('mongoose')
var Schema = mongoose.Schema

var suggestionCafeSchema = new Schema({
  name: String,
  address: String,
  tel: String,
  hours: String,
  rate: String,
  category: Array,
  imagesURL: Array
})

module.exports = mongoose.model('suggestion_newCafelist', suggestionCafeSchema)
