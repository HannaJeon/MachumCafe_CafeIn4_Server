var mongoose = require('mongoose')
var Schema = mongoose.Schema

var suggestionCafeSchema = new Schema({
  name : String,
  phoneNumber : String,
  address : String,
  hours : String
  category : Array
})
