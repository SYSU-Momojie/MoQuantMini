// components/mq/share-search/index.js
const api = require('../../../utils/api.js')
const dateUtil = require('../../../utils/date.js')

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
    }
  },

  lifetimes: {
    ready: function() {
      var data = wx.getStorageSync('allShare');
      var dt = wx.getStorageSync('allShareDt');
      if (data && dt && dt === dateUtil.getDt()) {
        this.setData({
          shareList: data
        })
      } else {
        api.post('getAllShareForSearch', {}, this.updateAfterRequest.bind(this));
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
          if (this.data.shareList[j].tsCode.indexOf(toFind[i]) >= 0) {
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
    clearHint: function() {
      this.setData({ hintList: [] });
    },
    handleTap: function (event) {
      console.log(event);
      this.triggerEvent('chooseShare', { tsCode: event.currentTarget.dataset.id});
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
