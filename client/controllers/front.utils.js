var conversation;

var sendlist = [];


Front.on('conversation', function (data) {
    console.log("conversation", data.conversation);
    conversation = data.conversation;
    sendlist.push(conversation.id);
});

function sendAll() {
    var msg = $('#txtbox').html;
    console.log(msg);
    // for(var i = 0; i < sendlist.length; i++) {
    //     var str = "https://api2.frontapp.com/conversations/" + sendlist[i] + "/messages";
    //     // xhttp = new XMLHttpRequest();
    //     // xhttp.open("POST", str, false);
    //     // xhttp.setRequestHeader("Authentication", "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzY29wZXMiOlsiKiJdLCJpc3MiOiJmcm9udCIsInN1YiI6InRoaXNpc250cmVhbCJ9.qNranl0lwol6iWouHN7vSyf3qEGKrkXgX9t5ekaklrc");
    //     // xhttp.setRequestHeader("Content-Type", "application/json");
    //     // xhttp.setRequestHeader("Accept", "application/json");

    //     var obj = {body: msg};
    //     $.ajax({
    //         url: str,
    //         type: 'post',
    //         dataType: 'json',
    //         success: function(data) {
    //             console.log(data);
    //         },
    //         data: obj
    //     });
    // }
}

function refresh(){
    var row = $("trow").html;
    console.log(row);
}
