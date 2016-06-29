/**
 * Created by Sumimasen on 2016-06-24.
 */

var db      = require('./db');
var later   = require('later');
var request = require('request');
var url     = "http://wthrcdn.etouch.cn/weather_mini?citykey=101201101";

exports.weather = function() {
    var basic = {h: [22], m: [10]};
    var composite = [basic];
    var sched = {schedules:composite};
    later.date.localTime();
    t = later.setInterval(getWeather, sched);
    function getWeather(){
        request({url:url,gzip:true}, function (error, response, body) {
            if (!error && response.statusCode == 200){

                var timestamp = parseInt((new Date()).valueOf()/1000);

                body          = JSON.parse(body);
                var forecast  = body.data.forecast[0];
                var wendu     = body.data.wendu;
                var ganmao    = body.data.ganmao;
                var city      = body.data.city;
                var fengxiang = forecast.fengxiang;
                var fengli    = forecast.fengli;
                var high      = forecast.high;
                var type      = forecast.type;
                var low       = forecast.low;
                var date      = forecast.date;

                var content = {
                    wendu     : wendu,
                    ganmao    : ganmao,
                    city      : city,
                    fengxiang : fengxiang,
                    fengli    : fengli,
                    high      : high,
                    type      : type,
                    low       : low,
                    date      : date,
                    inputtime : timestamp
                };

                db.add("weather",content);

                console.log("今天是"+date+",天气预报已经入库成功");
            };
        });
    }
};