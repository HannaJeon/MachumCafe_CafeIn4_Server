var mongoose = require('mongoose')
var Schema = mongoose.Schema

var cafeSchema = new Schema({
  name :  String,
  phoneNumber : String,
  address : String,
  latitude : String,
  longitude : String,
  summary : String,
  tableInfo : String,
  parking : String,
  hours : String,
  holiday : String,
  mainMenu : Array,
  menu : String,
  smokingArea : String,
  reservation : Boolean,
  wc : Boolean,
  terrace : Boolean,
  detailInfo : String,
  category : Array,
  imagesName : Array
})

// var cafeSchema = new Schema({
//   addr1: String,
//   addr2: String,
//   areacode: Number,
//   cat1: String,
//   cat2: String,
//   cat3: String,
//   contentid: Number,
//   contenttypeid: Number,
//   createdtime:  Number,
//   firstimage: String,
//   firstimage2: String,
//   mapx: Number,
//   mapy: Number,
//   mlevel: Number,
//   modifiedtime: Number,
//   readcount: Number,
//   sigungucode: Number,
//   tel: String,
//   title: String,
//   zipcode: Number
// })

module.exports = mongoose.model('cafelist', cafeSchema)
