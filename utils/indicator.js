var getValueFromMap = function (map, name) {
  if (map[name] != null) {
    return map[name].value;
  }
  return null;
}

var getYoyFromMap = function (map, name) {
  if (map[name] != null) {
    return map[name].yoy;
  }
  return null;
}

var getMomFromMap = function (map, name) {
  if (map[name] != null) {
    return map[name].mom;
  }
  return null;
}

module.exports = {
  getValueFromMap,
  getYoyFromMap,
  getMomFromMap
};