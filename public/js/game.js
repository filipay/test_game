var gameWindow = {
  width: window.innerWidth - 16,
  height: window.innerHeight - 16,
  mid: function () {
    return {
      x: this.width * 0.5,
      y: this.height * 0.5
    };
  }
};

Math.distance = function (o1, o2) {
  return Math.sqrt(Math.pow(o1.x - o2.x, 2) +
                   Math.pow(o1.y - o2.y, 2));
};

var game = new Phaser.Game(gameWindow.width, gameWindow.height, Phaser.AUTO, 'phaser-example', { create: create });

function create() {

    var sun = game.add.graphics();

    // graphics.lineStyle(2, 0xffd900, 1);

    sun.beginFill(0xffd900, 1);
    sun.drawCircle(0, 0, 100);
    sun.position.set(gameWindow.mid().x, gameWindow.mid().y);

    var planet = game.add.graphics();
    planet.beginFill(0x00d6bc, 1);
    planet.drawCircle(0,0, 10);
    planet.position.set(-150, 0);
    // sun.addChild(planet);
    orbit(planet, sun);

    var ship = game.add.graphics();
    ship.beginFill(0xaf2750, 1);
    ship.drawCircle(0, 0, 6);
    ship.position.set(- 20, 0);

    orbit(ship, planet);

    var planet2 = game.add.graphics();
    planet2.beginFill(0x00d6bc, 1);
    planet2.drawCircle(0,0, 10);
    planet2.position.set(-500, 0);
    // sun.addChild(planet2);
    orbit(planet2, sun);

}




var scaleCoords = function (object, max) {
  var ratio = {
    x: max.x / object.max.x,
    y: max.y / object.max.y
  };

  return {
    x: object.x * ratio.x,
    y: object.y * ratio.y
  };
};

var _1 = {
  x: 600,
  y: 800,
  max: {
    x: 1920,
    y: 1200
  }
};

var _2 = {
  x: 800,
  y: 600
};

var orbit = function (o1, o2) {
  o2.addChild(o1);

  var distance = Math.abs(o1.position.x);
  var diff = {
    x: o2.position.x - o1.position.x,
    y: o2.position.y - o1.position.y
  };
  // .to({x: [0, 500 , 500, 0, 0], y : [-200, -200, 200, 200, 0] },  6000, Phaser.Easing.Quadratic.None, true)

  // var x = [baseX, baseX + distance, baseX + distance, baseX, baseX];
  // var y = [baseY - distance, baseY - distance, baseY + distance, baseY + distance, baseY];
  // var x = [0, '+' + distance, distance, '-' + distance];
  // var y = ['-' + distance, -distance, '+' + distance * 2, distance, 0];


  var x = [-distance, distance * 2, distance * 2, -distance, -distance];
  var y = [-distance * 1.5, -distance * 1.5, distance * 1.5, distance * 1.5, 0];

  game.add
    .tween(o1)
    .to({x: x, y: y },  Math.randomInt(6000,2000) * distance/100, Phaser.Easing.Quadratic.None, true)
    .interpolation(function(v, k){
      return Phaser.Math.bezierInterpolation(v, k);
    })
    .repeat(Infinity);
};

var Planet = function (data) {

};
