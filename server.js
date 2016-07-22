var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
const csv = require('csv-parser');
const fs = require('fs');
const Fuse = require('fuse.js');

var movie_dictionary = [];

fs.createReadStream('moviemap.csv')
    .pipe(csv())
    .on('data', function(data) {
        movie_dictionary.push(data.Movie);
        // console.log('adding: ' + data.Movie);
    })
    .on('end', function(){
        console.log('FINISHED PARSING MOVIES INTO DICTIONARY!');
        // console.log(movie_dictionary);
        // console.log(movie_dictionary[592]);
    });

var fuse = new Fuse(movie_dictionary, {include: ['score'], threshold: 0.3}/*, {include: ['matches'], verbose: false}*/);

function fuzzyMatch(title) {
  var matches = fuse.search(removeLeadingArticles(title));
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
  var title = req.body.title;
  var match = fuzzyMatch(title);
  console.log(JSON.stringify(match));
  // console.log('matched: \"' + title + '\" with ' + movie_dictionary[match] + '!');
  if (match !== undefined) {
    console.log('matched: \"' + title + '\" with ' + movie_dictionary[match.item] + '!');
    res.send(JSON.stringify(movie_dictionary[match.item]));
  } else {
    console.log('No confident match.');
    res.send('No confident match.')
  }
})

app.listen(port, function(){
    console.log("Server running on port " + port + "...");
});
