var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var curl = require('curlrequest');

var app = express();

var path = require("path");

var port = process.env.PORT || 3000

// const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzY29wZXMiOlsiKiJdLCJpc3MiOiJmcm9udCIsInN1YiI6ImlzdGhpc2V2ZW5yZWFsMyJ9.JOoIWqEfwII13dzCrmlowqZILB4wZZN9Bv3jpX5RNTE";
// const authorization = "Bearer " + token;

// api tokens
const front_uri = 'https://api2.frontapp.com/contacts';
const front_token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzY29wZXMiOlsiKiJdLCJpc3MiOiJmcm9udCIsInN1YiI6ImFuZGNoaWxsX2lvIn0.mlpoMLQSuCBw49ZwZY4fqcgqwTAUPZhwKYs98Tj0FPw';
const smooch_uri = 'https://api.smooch.io/v1/appusers/';
const smooch_app_token = '0kntojv4o8o48nq92p1w9g3by';

app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname,"client", "views"));

app.use(express.static(path.resolve(__dirname, "client")));

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function(req, res){
    res.render("index");
});

function user_sleep(userId) {
  var state_stop = {'properties': {'state':'stop'}};
  // var state_stop = {'givenName': 'Bill'};

  request({
    method: 'PUT',
    url: smooch_uri + userId,
    headers: {
      'app-token' : smooch_app_token
    },
    json: state_stop
  }, function(error, response, body){
    console.log('ERROR?: ');
    console.log(error);
    console.log('RESPONSE?: ');
    console.log(response);
    console.log('SMOOCH PUT REQUEST RETURNED BODY: ');
    console.log(body);
    return body;
  });
  // var state_stop = {'properties' : {'state' : 'stop'}};
//   var options = {
//     method: 'PUT',
//     url: smooch_uri + userId,
//     headers: {
//       'app-token' : smooch_app_token
//     },
//     data: state_stop
//   };
//
//   curl.request(options, function(error, data){
//     console.log('ERROR?: ');
//     console.log(error);
//     console.log('SMOOCH PUT REQUEST RETURNED BODY: ');
//     console.log(data);
//     return data;
//   });
}

// set users to sleep
app.get('/sleep/:userId', function(req, res){
  var userId = req.params.userId;
  var resp_data = user_sleep(userId);
  res.send('recieved sleep call!');
});


app.listen(port, function(){
    console.log("Server running on port " + port + "...");
});
