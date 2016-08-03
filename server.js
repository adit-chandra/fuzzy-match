// keep heroku awake
var http = require("http");
setInterval(function() {
    http.get("http://fuzzy-match-and-chill.herokuapp.com/");
}, 300000); // every 5 minutes (300000)


var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
const csv = require('csv-parser');
const fs = require('fs');
const Fuse = require('fuse.js');

var movie_dictionary = [];

console.log('Piping movie sheet into fuse dictionary...');
fs.createReadStream('moviemap3.csv')
    .pipe(csv())
    .on('data', function(data) {
        var entry = data.Movie;
        // entry = entry.replace(/[!@#$%^&*'":;,\s+]/g, "");
        movie_dictionary.push(entry);
        // console.log('adding: ' + data.Movie);
    })
    .on('end', function(){
      console.log(movie_dictionary[98]);

        console.log('Done! Outputting verbose. Listening...');
        // console.log(movie_dictionary);
        // console.log(movie_dictionary[592]);
    });

// fuse tuning
// var params = {
//               include: ['score', 'matches'],
//               threshold: 0.3,
//               maxPatternLength: 50,
//               verbose: true
//             };

var fuse = new Fuse(movie_dictionary, { include: ['score', 'matches'],
                                        threshold: 0.35,
                                        // maxPatternLength: 50,
                                        // tokenize: true,
                                        verbose: true });

function fuzzyMatch(title) {
  //handle special chars
  var query = title.replace(/[!@#$%^&*'":;,\s+]/g, "");
  //fuzzy search dictionary
  var matches = fuse.search(removeLeadingArticles(query));
  //return top-scored match
  return matches[0];
}

function removeLeadingArticles(title) {
  return title;
}

var app = express();

var path = require("path");

var port = process.env.PORT || 3000

app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname,"client", "views"));

app.use(express.static(path.resolve(__dirname, "client")));

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function(req, res){
    res.render("index");
});

app.post('/match/', function(req, res){
  console.log('match call');
  var title = req.body.title;
  var match = fuzzyMatch(title);
  var fuzzy_title = movie_dictionary[match.item] + '';
  var fuzzy_tokens = fuzzy_title.split(' ');
  var title_tokens = title.split(' ');
  var numerical_token_match = true;

  if(fuzzy_tokens.length != title_tokens.length){
    numerical_token_match = false;
  } else {
    for(var i = 0; (i < fuzzy_tokens.length) && (i < title_tokens.length); i++) {
        console.log(parseInt(fuzzy_tokens[i]));
        console.log(parseInt(title_tokens[i]));
      if((parseInt(title_tokens[i]) > 0 && (!(parseInt(fuzzy_tokens[i]) > 0))) || (parseInt(fuzzy_tokens[i]) > 0 && (!(parseInt(title_tokens[i]) > 0)))){
        numerical_token_match = false;
        break;
      }
    }
  }

  console.log(JSON.stringify(match));
  if (((match !== undefined) && numerical_token_match) && (((title.length >= 7) && (match.score < 0.3)) || ((title.length < 7) && match.score < 0.17))) {
    console.log('MATCHED: \"' + title + '\" with ' + fuzzy_title + '!');
    res.send(JSON.stringify(fuzzy_title));
  } else {
    console.log('No confident match.');
    res.send(JSON.stringify('NOTHING'));
  }
})

app.listen(port, function(){
    console.log("Server running on port " + port + "...");
});
