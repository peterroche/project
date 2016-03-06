var express = require('express');
var sensor = require('./temp');
var logger = require('morgan');


var app = express();



//shows GET requests in the console
app.use(logger('dev'));


// create schema and read in temperatures
var mongoose = require('mongoose');
mongoose.connect('mongodb://mongodb2289rp:mi6fys@danu7.it.nuigalway.ie:8717/mongodb2289');
var tempModel = mongoose.model('Temperature', { temp: Number, time: Number});


//send data to database every second
//sec is used to store the number of points to make graphing easier.
time = -1;

var timer = setInterval(function(){

    if(time === 20 || time === -1){

	tempModel.remove(function(err, temperatures){
	if(err){
	    console.error(err);
	}else{
	    console.log('Deleted temperatures!')
	}
	});
	
	time = 0;
    }
    
    var temperature = new tempModel({ temp: temp, time: time });
    temperature.save(function(err){
	if(err){
	    console.log('Error when saving vehicles');
	}else{
	console.log('Saved temperature OK')
	}
    });
    time += 1;
}, 1000);




function sendTemp(Callback){

    tempModel.find(function(err, temperatures){
	if(err) return console.error(err);
	Callback(temperatures);
    });

};



//respond with data from mongo database
app.get('/mongodata',function(req, res){
    sendTemp(function(mongoTemps){
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.json(mongoTemps);
    });
});



//respond with live data
app.get('/live', function(req, res){
    res.setHeader("Access-Control-Allow-Origin", "*");
    var currentTemp = {"currentTemp": temp};
    res.json(currentTemp);
});


module.exports = app;
