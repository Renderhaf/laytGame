var express = require('express');
var socket = require("socket.io");
var app = express();
app.use(express.static(__dirname + '/static'));

connections = []

app.get('/Game', function (req, res) {
  res.sendfile(__dirname + '/static/game.html');
});

var server = app.listen(5000, function () {
  console.log('Example app listening on port 5000!');
});

var io = socket(server);

io.of("/Game").on("connection", function(socket){
  connections.push(socket);
  console.log("Connected to " + socket.id + " There are currently " + connections.length + " connections")


  socket.on("newplayer", function(data){
    console.log(data);
    io.of("/Game").emit("newplayer",data);
  })

  socket.on("disconnect", function(socket){
    connections.splice(connections.indexOf(socket),1);
    console.log("Disconnected, there are now " + connections.length + " connections");
  });

});