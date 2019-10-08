const api_host = 'http://localhost:8080/'
//const api_host = 'https://nemomojie.com/mq_api/'

const post = (api, param, success, fail) => {
  var obj = {
    url: api_host + api,
    data: param,
    method: 'POST',
    success: success,
    fail: fail
  }
  wx.request(obj)
}

module.exports = {
  post
}