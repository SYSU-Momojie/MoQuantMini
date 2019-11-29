// components/mq/share-note/share-note.js
const api = require('../../../utils/api.js')
const computedBehavior = require('miniprogram-computed')

Component({
  behaviors: [computedBehavior],
  /**
   * 组件的属性列表
   */
  properties: {
    tsCode: {
      type: String,
      value: ''
    },
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
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  lifetimes: {
  },

  watch: {
    'tsCode': function(newTsCode) {
      console.log(this.data.tsCode);
      if (this.data.tsCode != '000000.SZ') {
        setTimeout(this.requestData.bind(this), 100);
      }
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    requestData: function () {
      var param = {
        pageNum: this.data.pageNum,
        pageSize: this.data.pageSize,
        tsCode: this.data.tsCode
      };
      // this.showSpin();
      api.post('getNoteList', param, this.updateList.bind(this))
    },

    pageChanged: function ({
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

    updateList: function (resp) {
      console.log(resp)
      var data = resp.data;
      this.setData({
        list: data.list,
        total: Math.ceil((data.total - 1) / this.data.pageSize) + 1
      })
      // this.hideSpin();
    }
  }
})
