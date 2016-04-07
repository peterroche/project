var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var port = 3000;
var cors = require('cors');
var jwt = require('jwt-simple');
var _ = require('underscore');

app.use(cors());
app.set('jwtTokenSecret', 'raspPItoken');



var jsonParser = bodyParser.json();

var tokens = [];


function removeFromTokens(token) {
    console.log(tokens.length);
    for (var counter = 0; counter < tokens.length; counter++) {
        if (tokens[counter] === token) {
            tokens.splice(counter, 1);
            break;
        }
    }
    console.log(tokens.length);
}



// create schema and read in temperatures
var mongoose = require('mongoose');
mongoose.connect('mongodb://mongodb2289rp:mi6fys@danu7.it.nuigalway.ie:8717/mongodb2289');
var userModel = mongoose.model('User', { username: String, password: String});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.info('Connected to the database...')
});






app.get('/login/:username/:password', function (req, res) {
    var username = req.params.username;
    var password = req.params.password;
    userModel.findOne({ username: username, password: password }, 'username password', function(err, user){
        if(err){
            console.error(err);
        } else{
            console.info('User: ' + user);
            if(user === null){
                res.json({username: username, success: false});
            }
            else{
                var expires = new Date();
                expires.setDate((new Date()).getDate() + 1);
                var token = jwt.encode({
                    username: username,
                    expires: expires
                }, app.get('jwtTokenSecret'));

                tokens.push(token);
                res.json({ access_token: token, username: username, success: true});
            }
        }
    });   
});


app.post('/logout', jsonParser, function(req, res) {
    var token= req.body.access_token;
    removeFromTokens(token);
    res.send(200);
});


app.post('/registerUser', jsonParser, function (req, res) {
    
    userModel.findOne({ username: req.body.username }, 'username', function(err, user){
        if(err){
            console.error(err);
        } else{
            if(user !== null){
                res.json({username: req.body.username, password: req.body.password, register: false});
            } else{
                var users = new userModel({
                    username: req.body.username,
                    password: req.body.password
                });

                users.save(function(err){
                    if(err){
                        console.log('Error when saving user.');
                    }else{
                        console.log('User saved.')
                    }
                });

                res.json({username: req.body.username, password: req.body.password, register: true});
                
            }
        }
    });
    
    
});

app.listen(port);
console.info('Server listening on port 3000.....');