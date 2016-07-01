var Planet = function (info) {
  var self = this;

  self.name = info.name;
  self.sizeInRadius = Math.randomInt(10 * 1000, 4 * 1000);
  self.position = {
    x: Math.randomInt(1000),
    y: Math.randomInt(1000)
  };

  self.minerals = {
    iron: Math.randomInt(500),
    copper: Math.randomInt(500),
    gold: Math.randomInt(500)
  };


  self.distance = function (object) {
    var x_diff = Math.pow((self.postion.x - object.x), 2);
    var y_diff = Math.pow((self.postion.y - object.y), 2);
    return Math.sqrt(x_diff + y_diff);
  };


};

var System = function () {
  var self = this;

  self.name = String.random(3);
  self.planets = {};

  self._generatePlanets = function () {
    var noPlanets = Math.randomInt(10, 5);
    var planets = {};
    for (var i = 0; i < noPlanets; i++) {
      var name = self.name + ' - '+ i;
      planets[name] = new Planet({ name: name });
    }

    console.log(planets);
    return planets;
  };

  self._generatePlanets();
};

console.log(new System('xcd'));
