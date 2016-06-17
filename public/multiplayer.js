
var socket = io.connect();


socket.emit('createGame', {
  name: "xXx L0BBy",
  maxPlayers: 3,
  player: {
    _id: "1234",
    name: "Filip Piskor",
    username: "filipay"
  }
});


socket.emit('sendActiveGames');
