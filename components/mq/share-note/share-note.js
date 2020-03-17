// components/mq/share-note/share-note.js
const api = require('../../../behaviors/api.js')
const computedBehavior = require('miniprogram-computed')

Component({
  behaviors: [computedBehavior, api],
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
    showOverlay: {
      type: Boolean,
      value: false
    },
    chosenNote: {
      type: Object,
      value: {}
    }
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
      this.post('getNoteList', param, this.updateList.bind(this))
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

    updateList: function (data) {
      this.setData({
        list: data.list,
        total: Math.max(Math.floor(data.total / this.data.pageSize),
          Math.ceil(data.total / this.data.pageSize))
      })
    },

    showNoteDetail: function(e) {
      console.log(e);
      var idx = e.target.dataset.id;
      this.setData({
        chosenNote: this.data.list[idx],
        showOverlay: true
      })
    },

    onClickHide: function() {
      this.setData({
        showOverlay: false
      })
    }
  }
})
