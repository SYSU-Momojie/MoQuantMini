const api = require('../../../behaviors/api.js');
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
    showForecastDetail: {
      type: Boolean,
      value: false
    },
    latest: {
      type: Boolean,
      value: false
    },
    period: {
      type: String,
      value: ''
    },
    forecastReason: {
      type: String,
      value: ''
    },
    adjustReason: {
      type: String,
      value: ''
    },
    oneTime: {
      type: Boolean,
      value: ''
    },
    dprofit: {
      type: Number,
      value: 0
    }
  },

  lifetimes: {
    attached: function() {
      console.log('forecast-notify loaded');
      console.log(this.data.tsCode);
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  watch: {
    'tsCode': function(newTsCode) {
      console.log(newTsCode);
      if (this.data.tsCode != '000000.SZ') {
        setTimeout(this.requestData.bind(this), 100);
      }
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    requestData: function() {
      this.post('getForecastInfo', this.data.tsCode, this.update.bind(this))
    },

    update: function(data) {
      this.setData(data);
      console.log(this.data);
    },

    toShowForecastDetail: function() {
      this.setData({
        showForecastDetail: true
      });
    },

    toHideForecastDetail: function() {
      this.setData({
        showForecastDetail: false
      });
    }
  }
})
