var submit = function() {
  var host = document.getElementById('host').value;
  var port = document.getElementById('port').value;
  var obj = {
    connection : {
      host: host,
      port: port
    }
  }
  $.ajax({
    type: 'POST',
    url:  '/connections',
    data: JSON.stringify(obj),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json'
  }).done(function(data) {
    console.log(data);

  }).fail(function(err) {
    console.log(err);

  })
} 


var loc = window.location.href;
var full = 'ws://' + loc + '/';
var full = 'ws://127.0.0.1:8083';

var socket = new WebSocket(full);

socket.onmessage = function(message) {
  var data;
  try {
    data = message.data;
  } catch(e) {
    data = message;
  };

  console.log(data);

}
