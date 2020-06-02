// components/mq/table/index.js
const apiBehavior = require('../../../behaviors/api.js');
const computedBehavior = require('miniprogram-computed');
const indicator = require('../../../utils/indicator.js');

Component({
  behaviors: [apiBehavior, computedBehavior],
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
    ready: function() {
      this.requestData();
    }
  },

  computed: {
    pageList: function(data) {
      var arr = [];
      for (var i in data) {
        arr.push({
          tsCode: i.tsCode,
          pe: indicator.getValueFromMap(i, 'pe'),
          dprofitYoy: indicator.getYoyFromMap(i, 'dprofit_quarter'),
          revenueYoy: indicator.getYoyFromMap(i, 'revenue_quarter'),
        });
      }
      return arr;
    }
  },

  methods: {
    requestData: function() {
      var param = {
        pageNum: this.data.pageNum,
        pageSize: this.data.pageSize,
        orderBy: this.data.orderBy
      };
      this.post('getGrowList', param, this.updateList.bind(this))
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

    orderChanged: function(event) {
      var to = event.currentTarget.dataset.order;
      if (to !== this.data.orderBy) {
        this.setData({orderBy: to});
      } else {
        this.setData({orderBy: ''});
      }
      this.requestData();
    },

    checkDetail: function(event) {
      this.triggerEvent('chooseShare', { tsCode: event.currentTarget.dataset.id });
    }
  }


})