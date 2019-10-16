var notNum = function (num) {
  return (num === undefined || num === null || typeof num !== 'number');
}

var unit = function (num) {
  if (notNum(num)) {
    return '-'
  } else if (Math.abs(num) >= 100000000) {
    num = num / 100000000;
    return trunc(num) + '亿';
  } else if (Math.abs(num) >= 10000) {
    num = num / 10000;
    return trunc(num) + '万';
  } else {
    return trunc(num) + '';
  }
}

var percent = function (num) {
  if (notNum(num)) {
    return '-'
  } else {
    num = num * 100;
    return trunc(num) + '%';
  }
}

var trunc = function (num) {
  if (notNum(num)) {
    return '-'
  } else {
    return num.toFixed(Math.abs(num) >= 100 ? 0 : 2);
  }
}

var format = function (num, pattern) {
  // console.log(num + ' , ' + pattern + ' , ' + num.constructor);
  if (pattern === 'unit') {
    return unit(num);
  } else if (pattern === 'percent') {
    return percent(num);
  } else {
    return trunc(num);
  }
}

var truncArr = function(arr) {
  var narr = [];
  for (var i = 0 ; i < arr.length ; i++) {
    var num = arr[i];
    narr.push(trunc(num));
  }
  return narr;
}

module.exports = {
  percent: percent,
  trunc: trunc,
  truncArr: truncArr,
  unit: unit,
  format: format
};