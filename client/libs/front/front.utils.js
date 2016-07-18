var notifs = sessionStorage.getItem("notifs");
writeNotifs();

var conversation;

var contacts = [];
var contacts_name = [];
var user_handles = [];

Front.on('conversation', function (data) {
    conversation = data.conversation;
    // console.log(conversation);
    if (!(contacts.indexOf(conversation.id) > -1)) {
        contacts.push(conversation.id);
        contacts_name.push(conversation.contact.name);
        user_handles.push(conversation.contact.handle);
    }
    updateTable();
})

function get_input() {
  if($("#txtbox").val()){
    var input_userId = $("#txtbox").val();
    // list -> array
    var userIds = input_userId.splice(',');
    user_handles.concat(userIds);
  }
}

function clear_input() {
  $("#txtbox").val('');
}

function set_user_sleep() {
  get_input();
  for (var ind = 0; ind < user_handles.length; ind++){
      $.ajax({
        method: 'GET',
        url: '/sleep/' + user_handles[ind] + '/',
        success: function(data) {
        }
      });
  }
  updateNotifs(true);
  console.log('update notifs called!');
  return false;
}

function set_user_wake() {
  get_input();
  for (var ind = 0; ind < user_handles.length; ind++){
      $.ajax({
        method: 'GET',
        url: '/wake/' + user_handles[ind] + '/',
        success: function(data) {
        }
      });
  }
  updateNotifs(false);
  console.log('update notifs called!');
  return false;
}

function removeFrom(id) {
    // console.log(contacts_name[contacts_name.indexOf(contacts_name[id])]);
    // console.log(contacts[contacts.indexOf(contacts[id])]);
    contacts.splice(contacts.indexOf(contacts[id]), 1);
    contacts_name.splice(contacts_name.indexOf(contacts_name[id]), 1);
    updateTable();
    return false;
}

function updateNotifs(toSleep) {
  if (toSleep) {
    var state_cur = 'Sleep';
    var state_clr = '#ff0000';
  } else {
    var state_cur = 'Wake';
    var state_clr = '#0000ff';
  }
  $('#notifications').empty();
  notifs = [];
  sessionStorage.setItem("notifs", notifs);
  for (var i = 0; i < contacts.length; i++) {
    var notif = {contact : contacts_name[i], state: state_cur, clr : state_clr};
    console.log(notif);
    notifs.push(notif);
    // notifs.push($('<p style="color: #525252">' + notif + '<span style="color: ' + state_clr + '">' + state_cur + '</span>' + '.</p>'))
  }
  sessionStorage.setItem("notifs", notifs);
}

function writeNotifs() {
  if(notifs != null) {
    for (var i = 0; i < notifs.length; i++) {
      $('#notifications').append($('<p style="color: #525252">' + notifs[i].name  + ' set to <span style="color: ' + notifs[i].clr + '">' + notifs[i].state + '</span>' + '.</p>'));
    }
  }
}

function updateTable() {
    var table = $('<table></table>').addClass('table');
    for (var i = 0; i < contacts.length; i++) {
        var row = $('<tr></tr>').addClass('rowrow');
        var entry = $('<td></td>').addClass('entry').text(contacts_name[i]);
        var button = $('<button></button>').text('Remove');
        button.css({'font-size': '14px', 'border': '1px solid #525252', 'border-radius': '3px', 'background-color': '#dcdcdc', 'margin-top': '1px', 'color': '#525252'});
        button.attr("onClick", "removeFrom(" + i + ")");
        row.append(entry).append($('<td></td>').append($(button)));
        table.append(row);
    }
    $('#jtable').empty();
    $('#jtable').append(table);
}

function emptyContacts() {
  contacts.length = 0;
  contacts_name.length = 0;

}
