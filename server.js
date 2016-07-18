var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var curl = require('curlrequest');

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

app.get('/reply/:contact_id/:msg', function(req, res) {
  var contact_id = req.params.contact_id;
  var msg = req.params.msg;
  var body = {
              'body': msg,
              'text': msg,
              'options': {
                'tags': [],
                'archive': true
              },
              'to': [],
              'cc': [],
              'bcc': []
            }

  var options = {
                  url: 'https://api2.frontapp.com/conversations/' + contact_id + '/messages',
                  headers: {'Authorization': authorization},
                  include: true,
                  data: {
                    'body': msg,
                    'text': msg,
                    'options': {
                      'tags': [],
                      'archive': true
                    },
                    'to': [],
                    'cc': [],
                    'bcc': []
                  }
                };
  curl.request(options, function (err, parts) {
      parts = parts.split('\r\n');
      var data = parts.pop()
        , head = parts.pop();
      res.setHeader('Content-Type', 'application/json');
      console.log(data);
      res.send(data);
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
