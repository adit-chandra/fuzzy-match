var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var curl = require('curlrequest');

var app = express();

var path = require("path");

var port = process.env.PORT || 3000
/*
  debugging
*/
(function() {
    var childProcess = require("child_process");
    var oldSpawn = childProcess.spawn;
    function mySpawn() {
        console.log('spawn called');
        console.log(arguments);
        var result = oldSpawn.apply(this, arguments);
        return result;
    }
    childProcess.spawn = mySpawn;
})();
/*
  debugging
*/

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

function user_sleep(smoochId) {
  var user_props = {'state' : 'stop'};
  request({
    method: 'PUT',
    url: smooch_uri + smoochId,
    headers: {
      'app-token' : smooch_app_token
    },
    dataType: 'json',
    data: user_props
  }, function(error, response, body){
    return body;
  });
}

// set users to sleep
app.get('/sleep/:id', function(req, res){
  var id = req.params.id;
  res.send(user_sleep(id));
});

app.get('/', function(req, res){
    res.render("index");
});




  // var body = req.body;
  // console.log('BODY IS HERE' + body);
  // var url_str = 'https://api2.frontapp.com/conversations/' + contact_id + '/messages';
  // request({
  //   url: url_str,
  //   method: "POST",
  //   headers: {
  //     'Authorization': authorization
  //   },
  //   dataType: 'json',
  //   data: body,
  // }, function(err, resp, body) {
  //   console.log('BODY' + body);
  //   console.log('RESP' + resp);
  //   res.send(resp);
  // });
})

app.listen(port, function(){
    console.log("Server running on port " + port + "...");
});
