const api = require('../../../behaviors/api.js');
const computedBehavior = require('miniprogram-computed');

Component({
  behaviors: [api, computedBehavior],
  /**
   * 组件的属性列表
   */
  properties: {
    pageNum: {
      type: Number,
      value: 1
    },
    pageSize: {
      type: Number,
      value: 10
    },
    total: {
      type: Number,
      value: 1
    },
    list: {
      type: Array,
      value: []
    },
    msgType: {
      type: Number,
      value: 1
    }
  },
  
  /**
   * 生命周期
   */
  lifetimes: {
    ready: function() {
      this.requestData();
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  watch: {
    'msgType': function(newMsgType) {
      this.setData({
        pageNum: 1
      });
      setTimeout(this.requestData.bind(this), 100);
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

    requestData: function() {
      var param = {
        pageNum: this.data.pageNum,
        pageSize: this.data.pageSize,
        msgType: this.data.msgType
      };
      this.post('getLatestReportList', param, this.updateList.bind(this))
    },

    updateList: function(data) {
      this.setData({
        list: data.list,
        total: Math.ceil(data.total / this.data.pageSize)
      })
    },

    pageChanged: function({
      detail
    }) {
      var type = detail.type;
      if (type === 'next') {
        this.setData({
          pageNum: this.data.pageNum + 1
        });
      } else if (type === 'prev') {
        this.setData({
          pageNum: this.data.pageNum - 1
        });
      }
      this.requestData();
    },

    checkDetail: function(event) {
      this.triggerEvent('chooseShare', { tsCode: event.currentTarget.dataset.id });
    }
  }
})
