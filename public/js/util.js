Math.randomInt = function (max, min) {
  max = max || Number.MAX_SAFE_INTEGER;
  min = min || 0;
  return Math.floor(Math.random() * (max - min + 1) + min);
};

String.random = function (length) {
  var chars = '';
  for (var i = 0; i < length; i++) {
    chars += String.fromCharCode(Math.randomInt(97 + 25, 97));
  }

  return chars;
};
