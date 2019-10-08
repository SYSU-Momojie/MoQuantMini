// components/mq/table/index.js
const api = require('../../../utils/api.js')

Component({
  options: {},
  /**
   * 组件的属性列表
   */
  properties: {
    fixedColNum: {
      type: Number,
      value: 4
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
      value: [{tsCode: '000001.SZ'}]
    },
    orderBy: {
      type: String,
      value: ''
    },
    spinShow: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {

  },

  /**
   * 生命周期
   */
  lifetimes: {
    attached: function() {
      this.requestData();
    }
  },

  methods: {
    requestData: function() {
      var param = {
        pageNum: this.data.pageNum,
        pageSize: this.data.pageSize,
        g: false,
        peg: false
      };
      if (this.data.orderBy === 'g') {
        param.g = true;
      } else if (this.data.orderBy === 'peg') {
        param.peg = true;
      }
      this.showSpin();
      // api.post('getPageList', param, this.updateList.bind(this), null)
      this.hideSpin();
    },

    updateList: function({
      data
    }) {
      this.setData({
        list: data.list,
        total: Math.ceil((data.total - 1) / this.data.pageSize) + 1
      })
      //console.log(data);
      this.hideSpin();
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

    orderChanged: function(event) {
      var to = event.currentTarget.dataset.order;
      console.log(to);
      if (to !== this.data.orderBy) {
        this.setData({orderBy: to});
        this.requestData();
      }
    },

    showSpin: function() {
      this.setData({ spinShow: true});
    },

    hideSpin: function() {
      this.setData({ spinShow: false });
    },

    checkDetail: function(event) {
      console.log(event);
      this.triggerEvent('chooseShare', { tsCode: event.currentTarget.dataset.id });
    }
  }


})