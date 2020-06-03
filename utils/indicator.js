var getValueFromMap = function (map, name) {
  if (map == undefined) {
    return null;
  }
  if (map[name] != null) {
    return map[name].value;
  }
  return null;
}

var getYoyFromMap = function (map, name) {
  if (map == undefined) {
    return null;
  }
  if (map[name] != null) {
    return map[name].yoy;
  }
  return null;
}

var getMomFromMap = function (map, name) {
  if (map == undefined) {
    return null;
  }
  if (map[name] != null) {
    return map[name].mom;
  }
  return null;
}

var compareLess = function (x, y) {
  if (x === null && y === null) {
    return 0;
  } else if (x === null) {
    return 1;
  } else if (y === null) {
    return -1;
  } else if (x < y) {
    return -1;
  } else if (x === y) {
    return 0;
  } else {
    return 1;
  }
}

var compareLarger = function (x, y) {
  if (x === null && y === null) {
    return 0;
  } else if (x === null) {
    return 1;
  } else if (y === null) {
    return -1;
  } else if (x > y) {
    return -1;
  } else if (x === y) {
    return 0;
  } else {
    return 1;
  }
}

module.exports = {
  getValueFromMap,
  getYoyFromMap,
  getMomFromMap,
  compareLess,
  compareLarger
};