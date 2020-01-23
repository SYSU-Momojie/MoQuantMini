import Notify from '@vant/weapp/notify/notify';

// const api_host = 'http://localhost:9874/mq_api/'
const api_host = 'https://nemomojie.com/mq_api/'

module.exports = Behavior({
  properties: {
    spinShow: {
      type: Boolean,
      value: false
    }
  },
  methods: {
    post: function(api, param, success) {
      var callback = function(resp) {
        if (resp.errMsg === 'request:ok' && resp.data instanceof Object) {
          success(resp.data);
        } else {
          console.log(resp);
          Notify({
            message: `请求失败: ${resp.errMsg}`,
            type: 'danger'
          })
        }
        this.showSpin(false);
      };
      var obj = {
        url: api_host + api,
        data: param,
        method: 'POST',
        complete: callback.bind(this)
      }
      this.showSpin(true);
      wx.request(obj)
    },
    showSpin: function(s) {
      this.setData({
        spinShow: s
      });
    }
  }
})