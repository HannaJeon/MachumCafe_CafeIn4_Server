var mongoose = require('mongoose')
var Schema = mongoose.Schema

// 다이닝코드 크롤링 Schema
var cafeSchema = new Schema({
  name: String,
  address: String,
  tel: String,
  keyword: Array,
  hours: String,
  menu: String,
  latitude: Number,
  longitude: Number,
  category: Array,
  imagesURL: Array
})

// xlsx 카페목록 Schema
// var cafeSchema = new Schema({
//   name:  String,
//   phoneNumber: String,
//   address: String,
//   latitude: String,
//   longitude: String,
//   summary: String,
//   tableInfo: String,
//   parking: String,
//   hours: String,
//   holiday: String,
//   mainMenu: Array,
//   menu: String,
//   smokingArea: String,
//   reservation: Boolean,
//   wc: Boolean,
//   terrace: Boolean,
//   detailInfo: String,
//   category: Array,
//   imagesName: Array
// })

module.exports = mongoose.model('cafelist', cafeSchema)
