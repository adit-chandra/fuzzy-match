var queries = JSON.parse(sessionStorage.getItem('queries', queries));
var matches = JSON.parse(sessionStorage.getItem('matches', matches));

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
      sessionStorage.setItem("queries", JSON.stringify(queries));

      matches.push(data);
      console.log(matches);
      sessionStorage.setItem("matches", JSON.stringify(matches));
    }
  });
  return true;
}

function writeMatches() {
  for (var i = 0; i < matches.length; i++) {
    if((queries[i] != null) && (matches[i] != null)) {
      if (matches[i] == 'NOTHING') {
        $('#results').append($('<p style="color: #525252">' + '<span style="color: #000000;">\"' + queries[i]  + '\"</span>' + ' fuzzy matched to: ' + '<span style="color: #ff005c;">no confident match</span>' + '.</p>'));
      } else {
        $('#results').append($('<p style="color: #525252">' + '<span style="color: #000000;">\"' + queries[i]  + '\"</span>' + ' fuzzy matched to: ' + '<span style="color: #00ffab;">' + matches[i] + '</span>' + '.</p>'));
      }
    }
  }
}
