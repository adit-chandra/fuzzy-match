var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');

var app = express();

var path = require("path");

var port = process.env.PORT || 3000

const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzY29wZXMiOlsiKiJdLCJpc3MiOiJmcm9udCIsInN1YiI6ImlzdGhpc2V2ZW5yZWFsMyJ9.JOoIWqEfwII13dzCrmlowqZILB4wZZN9Bv3jpX5RNTE";
const authorization = "Bearer " + token;

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

// function user_sleep(smoochId) {
//   var user_props = {'state' : 'stop'};
//   request({
//     method: 'PUT',
//     url: smooch_uri + smoochId,
//     headers: {
//       'app-token' : smooch_app_token
//     },
//     dataType: 'json',
//     data: user_props
//   }, function(error, response, body){
//     return body;
//   });
// }

// set users to sleep
app.get('/sleep/:id', function(req, res){
  var id = req.params.id;
  console.log('RECIEVED SLEEP CALL FOR: ' + id);
  // user_sleep = function (smoochId) {
  //   var user_props = {'state' : 'stop'};
  //   request({
  //     method: 'PUT',
  //     url: smooch_uri + smoochId,
  //     headers: {
  //       'app-token' : smooch_app_token
  //     },
  //     dataType: 'json',
  //     data: user_props
  //   }, function(error, response, body){
  //     return body;
  //   });
  // };
  // res.send(user_sleep(id));
  res.send('WHATS UP');
});


app.listen(port, function(){
    console.log("Server running on port " + port + "...");
});
