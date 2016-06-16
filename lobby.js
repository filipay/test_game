var lobby = {

  init: function (s_io, socket) {
    this.io = s_io;
    this.gameSocket = socket;

    this.activeGames = {};

    this.bindTriggers();
  },

  bindTriggers: function () {
    this.gameSocket.on('connect', this.connect);

  },

  createGame: function (data) {
    var roomId = (Math.random() * 100000).toString();
    data.roomId = roomId;
    this.connect(data);
  },

  connect: function (data) {
    activeGames[data.roomId] = activeGames[data.roomId] || [];
    activeGames[data.roomId].push(data.player);
    this.join(data.roomId);
  },

  disconnect: function () {

  },

  sendActiveGames: function () {
    this.emit('showActiveGames', this.activeGames);
  }
};

exports.init = lobby.init;
