var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var request = require('request')
var cheerio = require('cheerio')
var Cafe = require('../../model/cafe')
var suggestion = require('./suggestion/suggestion')
var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyBNTjHJ-wYRN_p9x7HMJu-_sI2LG-kzVj4'
})

router.use('/suggestion', suggestion)

// 크롤링 강남구 카페 DB
router.get('/cafe', function(req, res) {
  var count = 0

  yangpyeong.forEach(function(val) {
    for(var i = 0; i <= 10; i++) {
      var url = "http://www.diningcode.com/list.php?page="+i+"&chunk=10&query=" + encodeURIComponent(val)
      request(url, function(err, res, body) {
        if(err) throw err
        var $ = cheerio.load(body)

        var cafe = $("div.dc-restaurant-name")
        // 카페 하나씩
        cafe.each(function() {
          var cafeUrl = "http://www.diningcode.com/" + $(this).find("a").attr("href")
          request(cafeUrl, function(err, res, body) {
            var $ = cheerio.load(body)
            var name = $("div#item-rn > span.item-rn-title").text()
            var keywords = []
            var category = []
            $("a.urlkeyword").each(function() {
              var keyword = $(this).text()
              categoryFunc(keyword, category)
              keywords.push(keyword)
            })
            var length = $("div.item-information-text").length-1
            var address = $("div:nth-child("+ length +") > div.item-information-text").text()
            var tel
            if($("div#item-tel > div.item-information-text").text().length > 1) {
              tel = $("div#item-tel > div.item-information-text").text()
            }
            if($("div.rest-time-block").length !== 0) {
              var hours = ""
              $("div.rest-time-block").each(function() {
                hours += $(this).find("div.rest-time-left").text()
                hours += ": " + $(this).find("div.rest-time-right > div.time").text() + "\n"
              })
            }
            var menu
            if($("div.rest-menu-block").length !== 0) {
              var menu = ""
              $("div.rest-menu-block").each(function() {
                menu += $(this).find("div.rest-menu-left").text()
                menu += " : " + $(this).find("div.rest-menu-right > div.time").text() + "\n"
              })
            }
            var imagesURL = []
            $("td#photo_empty_cell1").find("img").each(function() {
              if($(this).attr("b_id") !== "instagram" && $(this).attr("id").substring(1) <= 5) imagesURL.push($(this).attr("src"))
            })

            googleMapsClient.geocode({
              address: address
            }, function(err, res) {
              if(err) throw err

              var latitude = res.json.results[0].geometry.location.lat
              var longitude = res.json.results[0].geometry.location.lng

              Cafe.find({ "name": name, "address": address }, function(err, cafe) {
                if(err) throw err
                if(cafe.length === 0) {
                  var cafe = new Cafe()
                  cafe.name = name
                  cafe.address = address
                  cafe.tel = tel
                  cafe.hours = hours
                  cafe.keywords = keywords
                  cafe.menu = menu
                  cafe.imagesURL = imagesURL
                  cafe.category = category
                  cafe.location = [longitude, latitude]

                  cafe.save(function(err) {
                    if(err) throw err
                    count ++
                    console.log(count)
                  })
                }
              })
            })
          })
        })
      })
    } // for
  }) // forEach
  res.json("강남구 완료")
})

// 카테고리화
function categoryFunc(keyword, category) {
  var obj = {
    "주차": ["전용주차장", "주차가능", "무료주차", "발렛"],
    "테라스": ["테라스", "정원", "야외"],
    "스터디": ["스터디", "공부", "편안한의자", "편한의자", "편한"],
    "편한의자": ["편한의자", "공부", "편안한의자", "스터디", "편한"],
    "모임": ["모임", "모임장소", "여자들끼리", "남자들끼리"],
    "24시": ["24시"],
    "미팅룸": ["미팅룸", "미팅", "룸식", "회의", "회의장", "룸", "단체석"],
    "디저트": ["디저트", "브런치", "케익", "케이크"],
    "로스팅": ["로스팅", "로스터리"],
    "넓은공간": ["넓은공간", "넓은테이블", "단체석"],
    "드라이브": ["드라이브", "모닥불", "산책로"],
    "산책로": ["산책로", "모닥불", "드라이브"],
    "모닥불": ["모닥불", "드라이브", "산책로"],
    "북카페": ["북", "만화"],
    "좌식": ["좌식", "좌식바"],
    "베이커리": ["베이커리", "빵집", "건강빵", "빵"],
    "연중무휴": ["연중무휴", "365일영업", "365"],
    "이색카페": ["이색카페", "이색"],
    "아이와함께": ["아이와함께", "아이와같이", "아이랑", "베이비체어", "놀이방"],
    "조용한": ["조용한", "차분한"],
    "고급스러운": ["고급스러운", "럭셔리", "고급", "고풍", "유럽풍", "세련된"],
    "여유로운": ["여유로운", "평화로운", "차분한", "한가한", "힐링"],
    "힐링": ["힐링", "평화로운", "차분한", "한가한", "여유로운"],
    "야경": ["야경"]
  }
  for(key in obj) {
    obj[key].forEach(function(str) {
      if(keyword.indexOf(str) !== -1) {
        var cat = category.filter(function(cat) { return key === cat })
        if(cat.length === 0) category.push(key)
      }
    })
  }
}

// 카페DB 중복검사
router.get('/test', function(req, res) {
  var count = 0
  Cafe.find({}, function(err, cafes) {
    for(var i = 0; i < cafes.length; i++) {
      for(var j = i+1; j < cafes.length; j++) {
        if(cafes[i].address === cafes[j].address && cafes[i].name === cafes[j].name) {
          // cafes[j].remove(function(err, result) {
          //   count++
          //   console.log(count)
          //   // console.log(result)
          //   // console.log("중복있음", i, j, cafes[i].address)
          // })
          console.log("중복있음", i, j, cafes[i].address)
        }
      }
      // console.log('out', i, j)
    }
  })
  res.json("중복검사")
})

router.get('/test1', function(req, res) {
  Cafe.find(function(err, cafes) {
    cafes.forEach(function(cafe) {
      cafe.rating = 0.0
      cafe.save(function(err) {
        if(err) throw err
      })
    })
  })
  res.json("완료")
})

module.exports = router
