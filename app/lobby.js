/*
  Handles connections and movement inbetween rooms
*/
var Lobby = function() {
  //Self needs to be declared to reference within internal functions
  var self = this;
  self.rooms = {};
  self.players = {};

  //Initialise a connection
  self.init = function (io, socket) {
    console.log("Initalising.");
    self.io = io;
    self.gameSocket = socket;


    self._bindTriggers();
  };

  //Bind the events
  self._bindTriggers = function () {
    console.log("Binding triggers.");
    self.gameSocket.on('joinGame', self.connect);
    self.gameSocket.on('disconnect', self.disconnect);
    self.gameSocket.on('requestRooms', self.sendActiveRooms);
  };

  /*
  On connect, add user to a room or create a new one with given parameters
  If a player is in a room, remove them from said room and place them in the desired one
  */
  self.connect = function (data) {

    //Check if user wants to join a room
    //If not generete a new room id
    if (!data.room.roomId) {

      var roomId = -1;
      console.log(data);

      //Generate random IDs until available space is found
      do {
        roomId = Math.floor((Math.random() * 100000)).toString();
      } while (self.rooms[roomId] !== undefined);

      console.log("Created room with id: " + roomId);

      data.room.roomId = roomId;
    }

    //Assign the current socket to the player
    data.player.socket = this;

    console.log(data.player.username + " connected");

    //Check if room is availale, otherwise generate a new one
    var room = self.rooms[data.room.roomId] || new Room(data.room);
    self.rooms[data.room.roomId] = room;

    //See if the player already exists in game, if not create a new one
    var player = self.players[data.player.username] || data.player;

    self.players[player.username] = player;
    this.join(data.room.roomId);

    //Check if player belongs to a room already, if so remove them from the room
    if (player.inRoom) {
      console.log("Switching rooms..");
      self.rooms[player.inRoom].removePlayer(player, function (err) {
        if (err) console.log(err);
      });
    }

    //Add a user to a room and notify everyone
    room.addPlayer(player, function (err) {
      if (err) console.log(err);
      self.sendActiveRooms(true);
    });

  };

  //TODO handle user disconnect
  self.disconnect = function () {
    console.log(this.id + ' disconnected');
  };

  // Send information about the available rooms in an accessible format
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
};


//Handles room stuff
var Room = function (data) {

  var self = this;
  self.name = data.name;
  self.players = {};
  self.maxPlayers = data.maxPlayers;
  self._id = data.roomId;
  console.log(data);


  // Adds player to the room
  self.addPlayer = function (player, callback) {
    var err;
    if (self.players[player.username]) {

      err = new Error(player.username + " already exists in room: " + self._id);

    } else if (Object.keys(self.players).length === self.maxPlayers) {

      err = new Error(player.username + " maximum players reached in room: " + self._id);

    } else {

      self.players[player.username] = player;
      player.inRoom = self._id;

      console.log(player.username + " added to room: " + self._id);

    }
    if (callback) callback(err);
  };

  //Removes player from the room
  self.removePlayer = function (player, callback) {
    var err;

    if (!self.players[player.username]) {
      err = new Error(player.username + ' isn\'t present in the room!');
    } else if (player.inRoom !== self._id) {
      err = new Error(player.username + ' room ID doesn\'t match this room!');
    } else {
      delete self.players[player.username];
      player.inRoom = undefined;
      console.log(player.username + " removed from room: " + self._id);
    }
    if (callback) callback(err);
  };

  // Returns the summary of the room
  self.info = function () {
    return {
      id: self._id,
      name: self.name,
      noPlayers : Object.keys(self.players).length + ' / ' + self.maxPlayers,
      players: Object.keys(self.players)
    };
  };
};

//Create a lobby and export it
module.exports = new Lobby();
