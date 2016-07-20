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
const front_uri = 'https://api2.frontapp.com/conversations/';
// const front_token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzY29wZXMiOlsiKiJdLCJpc3MiOiJmcm9udCIsInN1YiI6ImFuZGNoaWxsX2lvIn0.mlpoMLQSuCBw49ZwZY4fqcgqwTAUPZhwKYs98Tj0FPw'; // production token
const front_token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzY29wZXMiOlsiKiJdLCJpc3MiOiJmcm9udCIsInN1YiI6ImlzdGhpc2V2ZW5yZWFsMyJ9.JOoIWqEfwII13dzCrmlowqZILB4wZZN9Bv3jpX5RNTE'; // dev token
const smooch_uri = 'https://api.smooch.io/v1/appusers/';
// const smooch_app_token = 'at8jc982yoiaa8qb6d59z9xrl'; // production token
const smooch_app_token = '0kntojv4o8o48nq92p1w9g3by'; //dev token
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

function user_sleep(userId, toSleep) {
  if(toSleep) {
    var state = {'properties': {'state':'stop'}};
  } else {
    var state = {'properties': {'state':'webhook'}};
  }
  request({
    method: 'PUT',
    url: smooch_uri + userId,
    headers: {
      'app-token' : smooch_app_token
    },
    json: state
  }, function(error, response, body){
    console.log('ERROR?: ');
    console.log(error);
    console.log('RESPONSE?: ');
    console.log(response);
    console.log('SMOOCH PUT REQUEST RETURNED BODY: ');
    console.log(body);
    return body;
  });
}

// set users to sleep
app.get('/sleep/:userId', function(req, res){
  var userId = req.params.userId;
  var resp_data = user_sleep(userId, true);
  res.send('recieved sleep GET!');
});

// set users to wake (restart)
app.get('/wake/:userId', function(req, res){
  var userId = req.params.userId;
  var resp_data = user_sleep(userId, false);
  res.send('recieved wake GET!');
});

// set user Front convo tags
function setTags(convoId, tags) {
  console.log('TAGS');
  console.log(tags);
  var tags_json = {'tags' : tags};
  request({
    method: 'PATCH',
    url: front_uri + userId,
    headers: {
      'Authorization' : 'Bearer' + front_token
    },
    json: tags_json
  }, function(error, response, body) {
    console.log('ERROR?: ');
    console.log(error);
    console.log('RESPONSE?: ');
    console.log(response);
    console.log('FRONT PATCH REQUEST RETURNED BODY: ');
    console.log(body);
    return body
  });
}

//set user convo tags in Front
app.post('/tag/', function(req, res){
  var tags = req.body.tags;
  var convoId = req.body.id;
  res.send('recieved tag set call POST!');
});


app.listen(port, function(){
    console.log("Server running on port " + port + "...");
});
