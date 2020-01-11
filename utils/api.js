const api_host = 'http://localhost:9874/mq_api/'
// const api_host = 'https://nemomojie.com/mq_api/'

const post = (api, param, callback) => {
  var obj = {
    url: api_host + api,
    data: param,
    method: 'POST',
    complete: callback
  }
  wx.request(obj)
}

module.exports = {
  post
}