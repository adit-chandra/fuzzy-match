var queries = JSON.parse(localStorage.getItem('queries', queries));
var matches = JSON.parse(localStorage.getItem('matches', matches));

//check for null storage
if ((queries == null) || (matches == null)) {
  queries = [];
  matches = [];
}

writeMatches();


function getFuzzyMatch() {
  var query = $('#input').val();
  console.log(query);
  var query_json = {'title': query}
  $.ajax({
    method: 'POST',
    url: '/match/',
    dataType: "json",
    data: query_json,
    success: function(data) {
      // console.log(data);
      queries.push(query);
      console.log(queries);
      localStorage.setItem("queries", JSON.stringify(queries));

      matches.push(data);
      console.log(matches);
      localStorage.setItem("matches", JSON.stringify(matches));
    }
  });
  return true;
}

function writeMatches() {
  console.log('MATCH CALL');
  for (var i = 0; i < matches.length; i++) {
    if((queries[i] != null) && (matches[i] != null)) {
      $('#results').append($('<p style="color: #525252">' + '<span style="color: #000000;">\"' + queries[i]  + '\"</span>' + ' fuzzy matched to: ' + '<span style="color: #00ffab;">' + matches[i] + '</span>' + '.</p>'));
    }
  }
}
