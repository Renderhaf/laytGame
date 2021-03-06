var express = require('express');
var socket = require("socket.io");
var app = express();
app.use(express.static(__dirname + '/static'));
var player = require(__dirname + "/serverplayer.js");
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connections = {} // dictionary {Socketid:player}

app.get('/GameMenu', function (req, res) {
  res.sendfile(__dirname + '/static/menu.html');
});
app.post("/GameMenu", function(req, res){
  if (req.body.info){
    res.send([Object.keys(connections).length])
  }
})
app.get('/loading', function (req, res) {
  res.sendfile(__dirname + '/static/loading.html');
});

app.get('/Game', function (req, res) {
  res.sendfile(__dirname + '/static/game.html');
});

var server = app.listen(5000, function () {
  console.log('Example app listening on port 5000!');
});

var io = socket(server);

function createPlayer(data){
  p = new player(data.x,data.y,data.size,data.color,data.name);
  return p;
}

io.of("/Game").on("connection", function(socket){
  socket.on("newplayer", function(data){
    if (!data.name) {return;} //stop if got null player
    connections[socket.id] = createPlayer(data);
    console.log("Connected to " + data.name + " There are currently " + Object.keys(connections).length + " connections");

    //giving back to the new player
    var players = [];
    for (var i = 0; i < Object.keys(connections).length; i++){
      players.push(connections[ Object.keys(connections)[i] ]);
    }
    socket.emit("players",players);

    // send new player to all others
    io.of("/Game").emit("newplayer",data); 
  })

  socket.on("disconnect", function(){
    //send all players to delete the dis player
    io.of("/Game").emit("disconnect",connections[socket.id]);

    // delete the part of object with the correct socket
    console.log("removing " + socket.id);
    delete connections[socket.id];
    console.log("Disconnected, there are now " + Object.keys(connections).length + " players");
  });

  socket.on("update", function(data){
    connections[socket.id] = createPlayer(data);
    io.of("/Game").emit("update",data);
  })

  socket.on("shots", function(data){
    io.of("/Game").emit("shots",data);
  })
});