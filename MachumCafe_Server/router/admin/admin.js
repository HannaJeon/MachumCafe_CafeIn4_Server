var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var request = require('request')
var cheerio = require('cheerio')
var Cafe = require('../../model/cafe')
var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyBNTjHJ-wYRN_p9x7HMJu-_sI2LG-kzVj4'
})

// 크롤링 강남구 카페 DB
router.get('/cafe', function(req, res) {
  var gangNamGu = ["역삼동+카페", "논현동+카페", "신사동+카페", "압구정동+카페", "청담동+카페", "삼성동+카페", "대치동+카페", "도곡동+카페", "개포동+카페", "대치동+카페", "세곡동+카페", "자곡동+카페"]
  gangNamGu.forEach(function(val) {
    for(var i = 0; i <= 10; i++) {
      var url = "http://www.diningcode.com/list.php?page="+i+"&chunk=10&query=" + encodeURIComponent(val)
      request(url, function(err, res, body) {
        if(err) throw err
        var $ = cheerio.load(body)

        $("div#search_list").each(function() {
          var cafe = $(this).find("div.dc-restaurant-name")
          // 카페 하나씩
          cafe.each(function() {
            var cafeUrl = "http://www.diningcode.com/" + $(this).find("a").attr("href")
            request(cafeUrl, function(err, res, body) {
              var $ = cheerio.load(body)
              var name = $("div#item-rn > span.item-rn-title").text()
              var keyword = []
              $("a.urlkeyword").each(function() {
                keyword.push($(this).text())
              })
              var length = $("div.item-information-text").length-1
              var address = $("div:nth-child("+ length +") > div.item-information-text").text()
              var tel = $("div#item-tel > div.item-information-text").text()
              var hours = $("div.rest-time._flex_1 > div.rest-info-contents").text()
              var menu = $("div.rest-menu._flex_1 > div.rest-info-contents").text()
              var imagesURL = []
              $("td#photo_empty_cell1").find("img").each(function() {
                imagesURL.push($(this).attr("src"))
              })
              var latitude
              var longitude
              var category = []

              googleMapsClient.geocode({
                address: address
              }, function(err, res) {
                if(err) throw err

                latitude = res.json.results[0].geometry.location.lat
                longitude = res.json.results[0].geometry.location.lng

                keyword.forEach(function(val) {
                  if(val.indexOf("전용주차장") !== -1 || val.indexOf('주차가능') !== -1 || val.indexOf("무료주차") !== -1 || val.indexOf("발렛") !== -1) {
                    var parking = category.filter(function(parking) { return "주차" === parking })
                    if(parking.length === 0) category.push("주차")
                  }

                  if(val.indexOf("테라스") !== -1 || val.indexOf('정원') !== -1 || val.indexOf("야외") !== -1) {
                    var terrace = category.filter(function(terrace) { return "테라스" === terrace })
                    if(terrace.length === 0) category.push("테라스")
                  }

                  if(val.indexOf("스터디") !== -1 || val.indexOf('공부') !== -1 || val.indexOf('편안한의자') !== -1 || val.indexOf('편한의자') !== -1 || val.indexOf('편한') !== -1) {
                    var study = category.filter(function(study) { return "스터디" === study })
                    if(study.length === 0) category.push("스터디")
                  }

                  if(val.indexOf("스터디") !== -1 || val.indexOf('공부') !== -1 || val.indexOf('편안한의자') !== -1 || val.indexOf('편한의자') !== -1 || val.indexOf('편한') !== -1) {
                    var comfortable = category.filter(function(comfortable) { return "편한의자" === comfortable })
                    if(comfortable.length === 0) category.push("편한의자")
                  }

                  if(val.indexOf("모임") !== -1 || val.indexOf('모임장소') !== -1 || val.indexOf("여자들끼리") !== -1 || val.indexOf("남자들끼리") !== -1) {
                    var meeting = category.filter(function(meeting) { return "모임" === meeting })
                    if(meeting.length === 0) category.push("모임")
                  }

                  if(val.indexOf("24시") !== -1) {
                    var allNight = category.filter(function(allNight) { return "24시" === allNight })
                    if(allNight.length === 0) category.push("24시")
                  }

                  if(val.indexOf("미팅") !== -1 || val.indexOf('룸식') !== -1 || val.indexOf("회의") !== -1 || val.indexOf("회의장") !== -1 || val.indexOf("룸") !== -1 || val.indexOf("단체석") !== -1) {
                    var room = category.filter(function(room) { return "미팅룸" === room })
                    if(room.length === 0) category.push("미팅룸")
                  }

                  if(val.indexOf("디저트") !== -1 || val.indexOf('브런치') !== -1) {
                    var desert = category.filter(function(desert) { return "디저트" === desert })
                    if(desert.length === 0) category.push("디저트")
                  }

                  if(val.indexOf("로스팅") !== -1 || val.indexOf('로스터리') !== -1) {
                    var roasting = category.filter(function(roasting) { return "로스팅" === roasting })
                    if(roasting.length === 0) category.push("로스팅")
                  }

                  if(val.indexOf("넓은공간") !== -1 || val.indexOf('넓은테이블') !== -1 || val.indexOf('단체석') !== -1) {
                    var wideSpace = category.filter(function(wideSpace) { return "넓은공간" === wideSpace })
                    if(wideSpace.length === 0) category.push("넓은공간")
                  }

                  if(val.indexOf("드라이브") !== -1 || val.indexOf('모닥불') !== -1 || val.indexOf('산책로') !== -1) {
                    var drive = category.filter(function(drive) { return "드라이브" === drive })
                    if(drive.length === 0) category.push("드라이브")
                  }

                  if(val.indexOf("산책로") !== -1 || val.indexOf('모닥불') !== -1 || val.indexOf('드라이브') !== -1) {
                    var promenade = category.filter(function(promenade) { return "산책로" === promenade })
                    if(bookCafe.length === 0) category.push("산책로")
                  }

                  if(val.indexOf("모닥불") !== -1 || val.indexOf('드라이브') !== -1 || val.indexOf('산책로') !== -1) {
                    var bonfire = category.filter(function(bonfire) { return "모닥불" === bonfire })
                    if(bonfire.length === 0) category.push("모닥불")
                  }

                  if(val.indexOf("북") !== -1 || val.indexOf('만화') !== -1) {
                    var bookCafe = category.filter(function(bookCafe) { return "북카페" === bookCafe })
                    if(bookCafe.length === 0) category.push("북카페")
                  }

                  if(val.indexOf("좌식") !== -1 || val.indexOf('좌식바') !== -1) {
                    var sedentary = category.filter(function(sedentary) { return "좌식" === sedentary })
                    if(sedentary.length === 0) category.push("좌식")
                  }

                  if(val.indexOf("베이커리") !== -1 || val.indexOf('빵집') !== -1 || val.indexOf('건강빵') !== -1 || val.indexOf('빵') !== -1) {
                    var bakery = category.filter(function(bakery) { return "베이커리" === bakery })
                    if(bakery.length === 0) category.push("베이커리")
                  }

                  if(val.indexOf("연중무휴") !== -1 || val.indexOf('365일영업') !== -1) {
                    var noHoliday = category.filter(function(noHoliday) { return "연중무휴" === noHoliday })
                    if(noHoliday.length === 0) category.push("연중무휴")
                  }

                  if(val.indexOf("이색") !== -1) {
                    var unique = category.filter(function(unique) { return "이색카페" === unique })
                    if(unique.length === 0) category.push("이색카페")
                  }

                  if(val.indexOf("아이와함께") !== -1 || val.indexOf('아이와같이') !== -1 || val.indexOf('아이랑') !== -1 || val.indexOf('베이비체어') !== -1 || val.indexOf('놀이방') !== -1) {
                    var withBaby = category.filter(function(withBaby) { return "아이와함께" === withBaby })
                    if(withBaby.length === 0) category.push("아이와함께")
                  }

                  // 분위기---
                  if(val.indexOf("조용한") !== -1 || val.indexOf('차분한') !== -1) {
                    var silent = category.filter(function(silent) { return "조용한" === silent })
                    if(silent.length === 0) category.push("조용한")
                  }

                  if(val.indexOf("고급스러운") !== -1 || val.indexOf('럭셔리') !== -1 || val.indexOf('고급') !== -1 || val.indexOf('고풍') !== -1 || val.indexOf('유럽풍') !== -1 || val.indexOf('세련된') !== -1) {
                    var luxury = category.filter(function(luxury) { return "고급스러운" === luxury })
                    if(luxury.length === 0) category.push("고급스러운")
                  }

                  if(val.indexOf("여유로운") !== -1 || val.indexOf('평화로운') !== -1 || val.indexOf('차분한') !== -1 || val.indexOf('한가한') !== -1 || val.indexOf('힐링') !== -1) {
                    var leisurely = category.filter(function(leisurely) { return "여유로운" === leisurely })
                    if(leisurely.length === 0) category.push("여유로운")
                  }

                  if(val.indexOf("힐링") !== -1 || val.indexOf('평화로운') !== -1 || val.indexOf('차분한') !== -1 || val.indexOf('한가한') !== -1 || val.indexOf('여유로운') !== -1) {
                    var healing = category.filter(function(healing) { return "힐링" === healing })
                    if(healing.length === 0) category.push("힐링")
                  }

                  if(val.indexOf("야경") !== -1) {
                    var nightView = category.filter(function(nightView) { return "야경" === nightView })
                    if(nightView.length === 0) category.push("야경")
                  }
                })
                Cafe.findOne({ "address" : address }, function(err, cafe) {
                  if(err) throw err
                  if(!cafe) {
                    var cafe = new Cafe()
                    cafe.name = name
                    cafe.address = address
                    cafe.tel = tel
                    cafe.hours = hours
                    cafe.keyword = keyword
                    cafe.menu = menu
                    cafe.imagesURL = imagesURL
                    cafe.latitude = latitude
                    cafe.longitude = longitude
                    cafe.category = category

                    cafe.save(function(err) {
                      if(err) throw err
                    })
                  }
                })

              })
            })
          })
        })
      })
    } // for
  }) // forEach
  res.json("강남구 완료")
})

router.get('/test', function(req, res) {
  Cafe.find({}, function(err, cafes) {
    for(var i = 0; i < cafes.length; i++) {
      for(var j = i+1; j < cafes.length; j++) {
        if(cafes[i].address === cafes[j].address) console.log("중복있음", i, j)
      }
      console.log('out', i, j)
    }
  })
  res.json("중복검사")
})

module.exports = router
