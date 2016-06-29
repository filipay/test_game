$(function () {

  var IO = {

    init: function () {
      IO.socket = io.connect();
      IO._bindTriggers();
    },

    _bindTriggers: function () {
      IO.socket.on('showRooms', IO.showRooms);
    },

    showRooms: function (data) {
      App.listRooms(data);
    }
  };

  var App = {

    init: function () {
      App.$doc = $(document);
      App._bindTriggers();
    },

    _bindTriggers: function () {
      App.$doc.on('click', '#join-room', App.requestRooms);
      App.$doc.on('click', '#create-room', App.newRoomForm);
    },

    requestRooms: function () {
      IO.socket.emit('requestRooms');
    },

    listRooms: function (data) {

      var template = $('<div/>').html($('#join-room-list').html());
      var listing_template = template.find('.room');
      var list = template.find('.list-group');
      list.empty();

      data.forEach(function (room) {
        var listing = listing_template.clone();
        listing.find('.name').html(room.name + listing.find('.name').html());
        listing.find('.description').html('Number of players: ' + room.noPlayers + ' | Players: ' + room.players);
        listing.prop('data-room-id', room.id);
        listing.find('.join-btn').on('click', function () {
          IO.socket.emit('joinGame', {
            player: App.player,
            room: {
              roomId: ''+room.id
            }
          });
        });

        list.append(listing);
      });
      $('.list-group').remove();
      list.insertAfter('#join-room');
    },

    newRoomForm: function () {

      var template = $('<div/>').html($('#create-room-template').html());

      template.find('button').on('click', App.processForm);

      $('.create-room-form').remove();
      template.insertAfter('#create-room');
    },

    processForm: function () {
      var roomName = $('#room-name');
      var maxPlayers = $('#room-max');

      IO.socket.emit('joinGame', {
        room: {
          name: roomName.val(),
          maxPlayers: parseInt(maxPlayers.val())
        },
        player: App.player
      });

      roomName.val('');
      maxPlayers.val('');
    },

    test: function () {

      App.player = {
        name: 'Ayy',
        username: 'Lmao' + Math.floor(Math.random() * 100)
      };

      IO.socket.emit('joinGame', {
        room: {
          roomId: 123,
          name: "xXx L0BBy",
          maxPlayers: 3
        },
        player: {
          _id: "1234",
          name: "Filip Piskor",
          username: "oh"
        }
      });

      // IO.socket.emit('sendActiveGames');

    }
  };

  IO.init();
  App.init();
  App.test();

});
