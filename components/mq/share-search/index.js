// components/mq/share-search/index.js
const api = require('../../../utils/api.js')
const dateUtil = require('../../../utils/date.js')
const strUtil = require('../../../utils/string.js')

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hintList: {
      type: Array,
      value: []
    },
    shareList: {
      type: Array,
      value: []
    },
    latest: {
      type: Array,
      value: []
    },
    inputValue: {
      type: String,
      value: ''
    }
  },

  lifetimes: {
    ready: function() {
      var data = wx.getStorageSync('allShare');
      var dt = wx.getStorageSync('allShareDt');
      if (data && dt && dt === dateUtil.getDt()) {
        this.setData({
          shareList: data
        });
      } else {
        api.post('getAllShareForSearch', {}, this.updateAfterRequest.bind(this));
      }
      var latest = wx.getStorageSync('searchLatest');
      if (latest) {
        this.setData({
          latest
        });
      }
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange: function(event) {
      // console.log(event);
      this.showHint(event.detail);
    },
    showHint: function(str) {
      var toFind = [];
      if (str === null || str === undefined || str.length === 0) {
        toFind = this.data.latest;
      } else {
        toFind.push(str)
      }
      var nHintList = [];
      for (var i = 0 ; i < toFind.length ; i++) {
        for (var j = 0 ; j < this.data.shareList.length ; j++) {
          if (strUtil.ignoreCaseContains(this.data.shareList[j].tsCode, toFind[i]) ||
            strUtil.ignoreCaseContains(this.data.shareList[j].py, toFind[i])) {
            nHintList.push(this.data.shareList[j]);
            if (nHintList.length === 5) {
              break;
            }
          }
        }
        if (nHintList.length === 5) {
          break;
        }
      }
      this.setData({
        hintList: nHintList
      });
      console.log(this.data.hintList);
    },
    onBlur: function(event) {
      // this.clearHint();
      setTimeout(this.clearHint.bind(this), 100);
    },
    onFocus: function(event) {
      this.showHint();
    },
    clearHint: function() {
      this.setData({ hintList: [] });
    },
    handleTap: function (event) {
      console.log(event);
      var code = event.currentTarget.dataset.id;
      var latest = this.data.latest;
      var index = latest.indexOf(code);
      if (index > -1) {
        latest.splice(index, 1);
      }
      latest.unshift(code);
      if (latest.length > 5) {
        latest.splice(5, 1);
      }
      this.setData({
        latest,
        inputValue: ''
      });
      wx.setStorage({
        key: 'searchLatest',
        data: latest,
      });
      this.triggerEvent('chooseShare', { tsCode: code });
    },
    updateAfterRequest: function(resp) {
      if (resp.errMsg === 'request:ok' && resp.data instanceof Array) {
        var list = resp.data;
        this.setData({
          shareList: list,
        });
        wx.setStorage({
          key: 'allShare',
          data: list,
        });
        wx.setStorage({
          key: 'allShareDt',
          data: dateUtil.getDt(),
        });
      } else {

      }
    }
  }
})
