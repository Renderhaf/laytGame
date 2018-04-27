var express = require('express');
var socket = require("socket.io");
var app = express();
app.use(express.static(__dirname + '/static'));
var player = require(__dirname + "/serverplayer.js");

connections = {} // dictionary {Socketid:player}

app.get('/Game', function (req, res) {
  res.sendfile(__dirname + '/static/game.html');
});

var server = app.listen(5000, function () {
  console.log('Example app listening on port 5000!');
});

var io = socket(server);

function createPlayer(data){
  p = new player(data.x,data.y,data.size,data.color,data.name);
  console.log(p);
  return p;
}

io.of("/Game").on("connection", function(socket){
  socket.on("newplayer", function(data){
    connections[socket.id] = createPlayer(data);
    console.log("Connected to " + data.name + " There are currently " + Object.keys(connections).length + " connections");

    //giving back to the new player
    var players = [];
    for (var i = 0; i < Object.keys(connections).length; i++){
      players.push(connections[ Object.keys(connections)[i] ]);
    }
    socket.emit("players",players);
    console.log("Sent back data to new player")

    io.of("/Game").emit("newplayer",data);
  })

  socket.on("disconnect", function(socket){
    // delete the part of object with the correct socket
    for (var i = 0; i < Object.keys(connections).length; i++){
      if (Object.keys(connections)[i] == socket.id){
        delete connections[Object.keys(connections)[i]];
      }
    }
    console.log("Disconnected, there are now " + Object.keys(connections).length + " players");
  });

});