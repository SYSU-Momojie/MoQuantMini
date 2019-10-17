var notNum = function (num) {
  return (num === undefined || num === null || typeof num !== 'number');
}

var unit = function (num, pre = -1) {
  if (notNum(num)) {
    return '-'
  } else if (Math.abs(num) >= 100000000) {
    num = num / 100000000;
    return trunc(num, pre) + '亿';
  } else if (Math.abs(num) >= 10000) {
    num = num / 10000;
    return trunc(num, pre) + '万';
  } else {
    return trunc(num, pre) + '';
  }
}

var percent = function (num, pre = -1) {
  if (notNum(num)) {
    return '-'
  } else {
    num = num * 100;
    return trunc(num, pre) + '%';
  }
}

var trunc = function (num, pre = -1) {
  if (notNum(num)) {
    return '-'
  } else {
    if (pre === -1 && num !== 0) {
      pre = 2 - Math.floor(Math.log10(Math.abs(num)));
    }
    if (pre < 0) {
      pre = 0;
    }
    return num.toFixed(pre);
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