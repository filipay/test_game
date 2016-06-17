function Lobby(){
  var self = this;

  self.init = function (io, socket) {
    console.log("Initalising.");
    self.io = io;
    self.gameSocket = socket;

    self.activeGames = {};

    self._bindTriggers();
  };

  self._bindTriggers = function () {
    console.log("Binding triggers.");
    self.gameSocket.on('createGame', self.createGame);
    self.gameSocket.on('joinGame', self.connect);
    self.gameSocket.on('leaveGame', self.disconnect);
    self.gameSocket.on('sendActiveGames', self.sendActiveGames);
  };

  self.createGame = function (data) {
    var roomId = -1;
    console.log(data);
    do {
      roomId = Math.floor((Math.random() * 100000)).toString();
    } while (self.activeGames[roomId] !== undefined);
    console.log("Created room with id: " + roomId);
    // console.log(self.gameSocket);
    data.roomId = roomId;
    data.player.socket = this;
    self.connect(data);
  };

  self.connect = function (data) {
    console.log(data.player.username + " connected");

    var room = self.activeGames[data.roomId] || new Room(data);
    room.addPlayer(data.player, function (err) {
      if (err) throw err;
    });

    self.activeGames[data.roomId] = room;
    data.player.socket.join(data.roomId);
  };

  self.disconnect = function () {

  };

  self.sendActiveGames = function () {
    this.emit('showActiveGames', self.activeGames);
    console.log(self.activeGames);
  };
}

function Room(data) {
  var self = this;

  self.name = data.name;
  self.players = [];
  self.maxPlayers = data.maxPlayers;
  self._id = data.roomId;

  self.addPlayer = function (player, callback) {
    var min_player = {
      username: player.username,
      socketId: player.socketId
    };

    var err;
    if (self.players.some(function (p) {
      return p.username === player.username;
    })) {
      err = new Error(player.username + " already exists!");
    } else if (self.players.length === self.maxPlayers) {
      err = new Error(player.username + " maximum players reached!");
      self.players.push(min_player);
    } else {
    }
    if (callback) callback(err);
  };
}

// console.log(lobby);
var lobby = new Lobby();
exports.init = lobby.init;
