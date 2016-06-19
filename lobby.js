function Lobby(){

  var self = this;
  self.activeRooms = {};
  self.players = {};

  self.init = function (io, socket) {
    console.log("Initalising.");
    self.io = io;
    self.gameSocket = socket;


    self._bindTriggers();
  };

  self._bindTriggers = function () {
    console.log("Binding triggers.");
    self.gameSocket.on('joinGame', self.connect);
    self.gameSocket.on('leaveGame', self.disconnect);
    self.gameSocket.on('requestRooms', self.sendActiveRooms);
  };


  self.connect = function (data) {
    if (!data.room.roomId) {

      var roomId = -1;
      console.log(data);

      do {
        roomId = Math.floor((Math.random() * 100000)).toString();
      } while (self.activeRooms[roomId] !== undefined);

      console.log("Created room with id: " + roomId);

      data.room.roomId = roomId;
    }

    data.player.socket = this;

    console.log(data.player.username + " connected");

    var room = self.activeRooms[data.room.roomId] || new Room(data.room);
    room.addPlayer(data.player, function (err) {
      if (err) console.log(err);
    });

    self.activeRooms[data.room.roomId] = room;
    self.players[this.id] = data.player;
    this.join(data.room.roomId);
  };

  self.disconnect = function () {

  };

  self.sendActiveRooms = function () {
    var rooms = [];
    Object.keys(self.activeRooms).forEach(function (roomId) {
      rooms.push(self.activeRooms[roomId].info());
    });
    this.emit('showRooms', rooms);
    console.log(rooms);
    console.log(Object.keys(self.activeRooms));
  };
}

function Room(data) {
  var self = this;
  console.log(data);
  self.name = data.name;
  self.players = {};
  self.maxPlayers = data.maxPlayers;
  self._id = data.roomId;

  self.addPlayer = function (player, callback) {

    var err;
    if (self.players[player.username]){
      err = new Error(player.username + " already exists!");
    } else if (Object.keys(self.players).length === self.maxPlayers) {
      err = new Error(player.username + " maximum players reached!");
    } else {
      self.players[player.username] = player;
      player.inRoom = self._id;
    }
    if (callback) callback(err);

  };

  self.info = function () {
    return {
      id: self._id,
      name: self.name,
      noPlayers : Object.keys(self.players).length + ' / ' + self.maxPlayers,
      players: Object.keys(self.players)
    };
  };
}

// console.log(lobby);
var lobby = new Lobby();
exports.init = lobby.init;
