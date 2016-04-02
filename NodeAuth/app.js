var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var port = 3000;
var cors = require('cors');

app.use(cors());
var jsonParser = bodyParser.json();



// create schema and read in temperatures
var mongoose = require('mongoose');
mongoose.connect('mongodb://mongodb2289rp:mi6fys@danu7.it.nuigalway.ie:8717/mongodb2289');
var userModel = mongoose.model('User', { username: String, password: String});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.info('Connected to the database...')
});





function autherizeUser(uname, pword){
   
    
    userModel.findOne({ username: uname, password: pword }, 'username password', function(err, user){
        if(err){
            console.error(err);
        } else{
            console.info('Found User: ' + user);
        }
    })
};




app.get('/login/:username/:password', function (req, res) {
    
    userModel.findOne({ username: req.params.username, password: req.params.password }, 'username password', function(err, user){
        if(err){
            console.error(err);
        } else{
            console.info('User: ' + user);
            if(user === null){
                res.json({username: req.params.username, password: req.params.password, success: false});
            }
            else{
                res.json({username: req.params.username, password: req.params.password, success: true});
            }
        }
    });
    
    
    
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