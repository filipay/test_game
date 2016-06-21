function Lobby(){

  var self = this;
  self.rooms = {};
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
      } while (self.rooms[roomId] !== undefined);

      console.log("Created room with id: " + roomId);

      data.room.roomId = roomId;
      data.room.callback = self.sendActiveRooms;
    }

    data.player.socket = this;

    console.log(data.player.username + " connected");

    var room = self.rooms[data.room.roomId] || new Room(data.room);

    self.rooms[data.room.roomId] = room;

    var player = self.players[data.player.username] || data.player;

    self.players[player.username] = player;
    this.join(data.room.roomId);

    if (player.inRoom) {
      console.log("Switching rooms..");
      self.rooms[player.inRoom].removePlayer(player, function (err) {
        if (err) console.log(err);
      });
    }
    room.addPlayer(player, function (err) {
      if (err) console.log(err);
      self.sendActiveRooms(true);
    });

  };

  self.disconnect = function () {

  };

  self.sendActiveRooms = function (all) {
    var rooms = [];
    Object.keys(self.rooms).forEach(function (roomId) {
      rooms.push(self.rooms[roomId].info());
    });

    if (all === true) self.io.emit('showRooms', rooms);
    else this.emit('showRooms', rooms);


    console.log(rooms);
    console.log(Object.keys(self.rooms));
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
    if (self.players[player.username]) {

      err = new Error(player.username + " already exists!");

    } else if (Object.keys(self.players).length === self.maxPlayers) {

      err = new Error(player.username + " maximum players reached!");

    } else {

      self.players[player.username] = player;
      player.inRoom = self._id;

    }
    if (callback) callback(err);
  };

  self.removePlayer = function (player, callback) {
    var err;

    if (!self.players[player.username]) {
      err = new Error(player.username + ' isn\'t presnet in the room!');
    } else if (player.inRoom !== self._id) {
      err = new Error(player.username + ' room ID doesn\'t match this room!');
    } else {
      self.players[player.username] = undefined;
      player.inRoom = undefined;
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

//Create a lobby and export it
var lobby = new Lobby();
exports.init = lobby.init;
