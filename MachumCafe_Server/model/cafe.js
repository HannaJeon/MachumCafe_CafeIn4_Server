var mongoose = require('mongoose')
var Schema = mongoose.Schema

var cafeSchema = new Schema({
  name :  String,
  phoneNumber : String,
  address: String,
  latitude: String,
  longitude: String,
  summary: String,
  tableInfo: String,
  parking: String,
  hours: String,
  holiday: String,
  mainMenu: Array,
  menu: String,
  smokingArea: String,
  reservation: Boolean,
  wc: Boolean,
  terrace: Boolean,
  detailInfo: String
})

module.exports = mongoose.model('cafelist', cafeSchema)
